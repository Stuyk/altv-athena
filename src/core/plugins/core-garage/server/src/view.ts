import * as alt from 'alt-server';

import { GarageSpaceShape } from '../../../../server/extensions/extColshape';
import { sha256 } from '../../../../server/utility/encryption';
import { GARAGE_INTERACTIONS } from '../../shared/events';
import { LOCALE_GARAGE_FUNCS } from '../../shared/locales';
import { isVehicleType } from '../../../../shared/enums/vehicleTypeFlags';
import { VehicleData } from '../../../../shared/information/vehicles';
import IGarage from '../../../../shared/interfaces/iGarage';
import { IVehicle } from '../../../../shared/interfaces/iVehicle';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { distance2d } from '../../../../shared/utility/vector';
import { Athena } from '../../../../server/api/athena';

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

        Athena.controllers.interaction.add({
            position: garage.position,
            description: `${LOCALE_GARAGE_FUNCS.BLIP_GARAGE} ${properTypeName}`,
            data: [garage.index], // Shop Index
            callback: GarageFunctions.open,
            isPlayerOnly: true,
        });

        Athena.controllers.blip.append({
            pos: garage.position,
            color: 4,
            sprite: 50,
            scale: 1,
            shortRange: true,
            text: LOCALE_GARAGE_FUNCS.BLIP_GARAGE,
        });

        Athena.controllers.marker.append({
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

    /**
     * 1. Obtain the current garage the player is accessing.
     * 2. Obtains all player vehicles from the database.
     * 3. Filter the vehicles down by doing the following...
     * 4. Verify the VehicleData has an entry for the vehicle model.
     * 5. Grab the garage type and verify that this garage type can spawn this vehicle.
     * 6. If the vehicle has never been spawned before it has {x: 0, y: 0, and z: 0 }
     *      6a. Meaning that the vehicle can be spawned ANYWHERE
     * 7. If the vehicle is not spawned and has no garage index.
     *      7a. Spawn the vehicle from any garage of the same type.
     * 8. If a garageIndex is not defined, look at currently spawned vehicles.
     *      8a. If a currently spawned vehicle does not match the vehicle we are looking for
     *      8b. Do not add to garage spawns
     *      8c. If the vehicle is close enough to a parking spot. Add to the vehicle list.
     *      8d. If the vehicle is too far away from parking spot we do not add the vehicle to the list.
     * 9. Push vehicle list to client.
     *
     * @static
     * @param {alt.Player} player
     * @param {(number | string)} shopIndex
     * @return {*}
     * @memberof GarageFunctions
     */
    static async open(player: alt.Player, shopIndex: number | string) {
        GarageUsers[player.id] = shopIndex;

        // 1
        const index = activeGarages.findIndex((garage) => garage.index === shopIndex);
        if (index <= -1) {
            return;
        }

        const garage = activeGarages[index];
        const garageType = activeGarages[index].type;

        // 2
        let playerVehicles = await Athena.player.get.allVehicles(player);

        // 3
        const validVehicles = playerVehicles.filter((vehicle) => {
            // 4
            // Check if the VehicleData has this vehicle model.
            const data = VehicleData.find((dat) => dat.name.toLowerCase() === vehicle.model.toLowerCase());
            if (!data) {
                return false;
            }

            // 5
            // Filter Vehicles by Type
            if (!isVehicleType(data.type, garageType)) {
                return false;
            }

            // 6
            // Unspawned / New Vehicle - Can Spawn Anywhere
            if (vehicle.position.x === 0 && vehicle.position.y === 0 && vehicle.position.z === 0) {
                return true;
            }

            // 7
            const existingVehicle = alt.Vehicle.all.find(
                (x) => x.data && x.data._id && vehicle._id && x.data._id.toString() === vehicle._id.toString())

            // 7
            // Return true because it has nowhere to go, it is not spawned, and has no garage. Allow spawning it.
            if (!existingVehicle && (vehicle.garageIndex === null || vehicle.garageIndex === undefined)) {
                return true;
            }

            // 8
            // It's an existing vehicle and is spawned but has no garage.
            if (existingVehicle && (vehicle.garageIndex === null || vehicle.garageIndex === undefined)) {
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
            if (Athena.vehicle.funcs.hasBeenSpawned(vehicle.id)) {
                return true;
            }

            return false;
        });

        VehicleCache[player.id] = validVehicles;

        if (validVehicles.length <= 0) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_VEHICLES_IN_GARAGE));
            return;
        }

        // 9
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
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const data = VehicleCache[player.id].find((ref) => `${ref.id.toString()}` === `${id}`);
        if (!data) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (Athena.vehicle.funcs.hasBeenSpawned(data.id)) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_ALREADY_SPAWNED));
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
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_PARKING_SPOTS));
            alt.emitClient(player, GARAGE_INTERACTIONS.CLOSE);
            return;
        }

        // Create and store the vehicle on the hashed vehicle parking spot.
        const hash = sha256(JSON.stringify(openSpot));
        const newVehicle = Athena.vehicle.funcs.spawn(data, openSpot.position, openSpot.rotation);

        if (!newVehicle) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        LastParkedCarSpawn[hash] = newVehicle;
        Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
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
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
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
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_TOO_FAR));
            return;
        }

        // Set the garage index.
        vehicle.data.garageIndex = shopIndex;
        Athena.vehicle.funcs.save(vehicle, { garageIndex: vehicle.data.garageIndex });

        // After setting the garage index. Despawn the vehicle.
        Athena.vehicle.funcs.despawn(vehicle.data.id);
        Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
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
