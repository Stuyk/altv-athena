import * as alt from 'alt-server';

import { GarageSpaceShape } from '../../../server/extensions/extColshape';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import VehicleFuncs from '../../../server/extensions/vehicleFuncs';
import { ServerMarkerController } from '../../../server/streamers/marker';
import { ServerBlipController } from '../../../server/systems/blip';
import { FactionInternalSystem } from '../../../server/systems/factionsInternal';
import { InteractionController } from '../../../server/systems/interaction';
import { sha256 } from '../../../server/utility/encryption';
import { GARAGE_INTERACTIONS } from '../../../shared-plugins/core-garage/events';
import { LOCALE_GARAGE_FUNCS } from '../../../shared-plugins/core-garage/locales';
import { isVehicleType } from '../../../shared/enums/vehicleTypeFlags';
import { VehicleData } from '../../../shared/information/vehicles';
import IGarage from '../../../shared/interfaces/iGarage';
import { IVehicle } from '../../../shared/interfaces/iVehicle';
import { Vector3 } from '../../../shared/interfaces/vector';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';
import { distance2d } from '../../../shared/utility/vector';

const PARKING_SPACE_DIST_LIMIT = 5;
const GarageUsers = {};
const LastParkedCarSpawn: { [key: string]: alt.Vehicle } = {};
const VehicleCache: { [id: string]: Array<IVehicle> } = {};

let activeGarages: Array<IGarage> = [];
let parkingSpots: { [key: string]: Array<GarageSpaceShape> } = {};

interface PositionAndRotation {
    position: Vector3;
    rotation: Vector3;
}

export class GarageFunctions {
    static init() {
        // does nothing
    }

    /**
     * Add a garage to the garage system
     * @static
     * @param {IGarage} garage
     * @param {boolean} isInit Leave as false if adding
     * @memberof GarageFunctions
     */
    static async add(garage: IGarage) {
        alt.log(`~g~Registered Garage - ${garage.index}`);

        const properTypeName = garage.type.charAt(0).toUpperCase() + garage.type.slice(1);

        InteractionController.add({
            position: garage.position,
            description: `${LOCALE_GARAGE_FUNCS.BLIP_GARAGE} ${properTypeName}`,
            data: [garage.index], // Shop Index
            callback: GarageFunctions.open,
            isPlayerOnly: true,
        });

        ServerBlipController.append({
            pos: garage.position,
            color: 4,
            sprite: 50,
            scale: 1,
            shortRange: true,
            text: LOCALE_GARAGE_FUNCS.BLIP_GARAGE,
        });

        ServerMarkerController.append({
            uid: `marker-garage-${garage.index}`,
            pos: new alt.Vector3(garage.position.x, garage.position.y, garage.position.z - 1),
            color: new alt.RGBA(0, 150, 0, 100),
            type: 1,
            maxDistance: 10,
            scale: { x: 2, y: 2, z: 3 },
        });

        if (!parkingSpots[garage.index]) {
            parkingSpots[garage.index] = [];
        }

        // Create Spots for Each Garage Parking spot
        for (let i = 0; i < garage.parking.length; i++) {
            const spot = garage.parking[i];
            const colshape = new GarageSpaceShape(spot.position, spot.rotation, 1);
            parkingSpots[garage.index].push(colshape);
        }

        activeGarages.push(garage);
    }

    static async open(player: alt.Player, shopIndex: number | string) {
        GarageUsers[player.id] = shopIndex;

        const index = activeGarages.findIndex((garage) => garage.index === shopIndex);
        if (index <= -1) {
            return;
        }

        const garage = activeGarages[index];
        const garageType = activeGarages[index].type;
        let playerVehicles = await playerFuncs.get.allVehicles(player);

        if (player.data && player.data.faction) {
            const factionVehicles = await FactionInternalSystem.getAllVehicles(player.data.faction);
            if (factionVehicles.length >= 1) {
                playerVehicles = playerVehicles.concat(factionVehicles);
            }
        }

        const validVehicles = playerVehicles.filter((vehicle) => {
            // Check if the VehicleData has this vehicle model.
            const data = VehicleData.find((dat) => dat.name === vehicle.model);
            if (!data) {
                return false;
            }

            // Filter Vehicles by Type
            if (!isVehicleType(data.type, garageType)) {
                return false;
            }

            // Unspawned / New Vehicle - Can Spawn Anywhere
            if (vehicle.position.x === 0 && vehicle.position.y === 0 && vehicle.position.z === 0) {
                return true;
            }

            // Check if Vehicle Type is null or undefined.
            // Basically means does this vehicle have a garage yet?
            if (vehicle.garageIndex === null || vehicle.garageIndex === undefined) {
                const existingVehicle = alt.Vehicle.all.find(
                    (x) => x.data && x.data._id.toString() === vehicle._id.toString(),
                );

                if (!existingVehicle) {
                    return false;
                }

                // The vehicle exists and may or may not be in a parking space
                // Need to check if the vehicle is close enough to a parking space.
                for (let i = 0; i < garage.parking.length; i++) {
                    const dist = distance2d(existingVehicle.pos, garage.parking[i].position);
                    if (dist > PARKING_SPACE_DIST_LIMIT) {
                        continue;
                    }

                    return true;
                }

                return false;
            }

            // Check if the garage index belongs to the vehicle if it's present.
            if (vehicle.garageIndex === shopIndex) {
                return true;
            }

            // Append vehicles that have been spawned that the player has access to to this list.
            if (VehicleFuncs.hasBeenSpawned(vehicle.id)) {
                return true;
            }

            return false;
        });

        VehicleCache[player.id] = validVehicles;

        if (validVehicles.length <= 0) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_VEHICLES_IN_GARAGE));
            return;
        }

        alt.emitClient(player, GARAGE_INTERACTIONS.OPEN, validVehicles);
    }

    /**
     * Determines if a position is close enough to a spot within 5 distance.
     * @param {Vector3} position - The position of the player.
     * @param {Array} parkingSpots - Array<PositionAndRotation>
     * @returns The distance between the player and the closest parking spot.
     */
    static isCloseToSpot(position: Vector3, parkingSpots: Array<PositionAndRotation>): boolean {
        for (let i = 0; i < parkingSpots.length; i++) {
            const dist = distance2d(position, parkingSpots[i].position);
            if (dist >= 5) {
                continue;
            }

            return true;
        }

        return false;
    }

    /**
     * Finds an open spot for the garage.
     * @param {uniontype} garageIndex - number | string
     */
    static findOpenSpot(garageIndex: number | string): PositionAndRotation {
        const spots = parkingSpots[garageIndex];
        if (!spots) {
            return null;
        }

        const spot = spots.find((x) => x.getSpaceStatus());
        return spot ? spot.getPositionAndRotation() : null;
    }

    /**
     * Spawns a vehicle based on the vehicle ID.
     * @param {alt.Player} player - The player that is spawning the vehicle.
     * @param {number} id - The vehicle id.
     */
    static spawnVehicle(player: alt.Player, id: number) {
        if (!player || !player.valid || !player.data) {
            return;
        }

        if (!VehicleCache[player.id] || VehicleCache[player.id].length <= 0) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const data = VehicleCache[player.id].find((ref) => `${ref.id.toString()}` === `${id}`);
        if (!data) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (VehicleFuncs.hasBeenSpawned(data.id)) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_ALREADY_SPAWNED));
            alt.emitClient(player, GARAGE_INTERACTIONS.CLOSE);
            return;
        }

        // Get the garage terminal information.
        const shopIndex = GarageUsers[player.id];
        const index = activeGarages.findIndex((garage) => garage.index === shopIndex);
        if (index <= -1) {
            console.error(`Garage at ${shopIndex} was not found.`);
            return;
        }

        const openSpot = GarageFunctions.findOpenSpot(shopIndex);
        if (!openSpot) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_PARKING_SPOTS));
            alt.emitClient(player, GARAGE_INTERACTIONS.CLOSE);
            return;
        }

        // Create and store the vehicle on the hashed vehicle parking spot.
        const hash = sha256(JSON.stringify(openSpot));
        const newVehicle = VehicleFuncs.spawn(data, openSpot.position, openSpot.rotation);

        if (!newVehicle) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        LastParkedCarSpawn[hash] = newVehicle;
        playerFuncs.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        alt.emitClient(player, GARAGE_INTERACTIONS.CLOSE);
    }

    /**
     * Removes a vehicle if its close to the garage.
     * Stores it in a garage.
     * @static
     * @param {alt.Player} player
     * @param {unknown} id
     * @return {*}
     * @memberof GarageFunctions
     */
    static despawnVehicle(player: alt.Player, id: number) {
        if (!player || !player.valid || !player.data) {
            return;
        }

        // Check that the vehicle is currently spawned and exists.
        const vehicle = alt.Vehicle.all.find((ref) => ref && ref.data && `${ref.data.id}` === `${id}`);
        if (!vehicle) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        // Get the garage garage information, and position.
        // Determine if the vehicle is close enough to the garage.
        const shopIndex = GarageUsers[player.id];
        const index = activeGarages.findIndex((garage) => garage.index === shopIndex);
        if (index <= -1) {
            console.error(`Garage at ${shopIndex} was not found.`);
            return;
        }

        const garage = activeGarages[index];
        const dist = distance2d(vehicle.pos, garage.position);

        // Check if the vehicle is either close to a parking spot or the garage itself.
        if (dist >= 10 && !GarageFunctions.isCloseToSpot(vehicle.pos, garage.parking)) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_TOO_FAR));
            return;
        }

        // Set the garage index.
        vehicle.data.garageIndex = shopIndex;
        VehicleFuncs.save(vehicle, { garageIndex: vehicle.data.garageIndex });

        // After setting the garage index. Despawn the vehicle.
        VehicleFuncs.despawn(vehicle.data.id);
        playerFuncs.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }
}

alt.onClient(GARAGE_INTERACTIONS.SPAWN, GarageFunctions.spawnVehicle);
alt.onClient(GARAGE_INTERACTIONS.DESPAWN, GarageFunctions.despawnVehicle);

alt.on('entityEnterColshape', (colshape: alt.Colshape | GarageSpaceShape, entity: alt.Entity) => {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    if (!(colshape instanceof GarageSpaceShape)) {
        return;
    }

    colshape.setSpaceStatus(false);
});

alt.on('entityLeaveColshape', (colshape: alt.Colshape | GarageSpaceShape, entity: alt.Entity) => {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    if (!(colshape instanceof GarageSpaceShape)) {
        return;
    }

    colshape.setSpaceStatus(true);
});
