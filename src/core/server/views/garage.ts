import * as alt from 'alt-server';

import { View_Events_Garage } from '../../shared/enums/views';
import { isVehicleType } from '../../shared/flags/VehicleTypeFlags';
import { VehicleData } from '../../shared/information/vehicles';
import { IVehicle } from '../../shared/interfaces/IVehicle';
import { Vector3 } from '../../shared/interfaces/Vector';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { BlipController } from '../systems/blip';
import { FactionInternalSystem } from '../systems/factionsInternal';
import { InteractionController } from '../systems/interaction';
import { MarkerController } from '../systems/marker';
import { sha256 } from '../utility/encryption';

const GarageUsers = {};
const LastParkedCarSpawn: { [key: string]: alt.Vehicle } = {};
const VehicleCache: { [id: string]: Array<IVehicle> } = {};

interface PositionAndRotation {
    position: Vector3;
    rotation: Vector3;
}

class GarageFunctions {
    static init() {
        const garages = [...DEFAULT_CONFIG.VEHICLE_GARAGES];

        for (let i = 0; i < garages.length; i++) {
            const garage = garages[i];
            const properTypeName = garage.type.charAt(0).toUpperCase() + garage.type.slice(1);

            InteractionController.add({
                position: garage.position,
                description: LocaleController.get(LOCALE_KEYS.GARAGE_DESCRIPTION, properTypeName),
                type: 'garage',
                data: [i], // Shop Index
                callback: GarageFunctions.open,
            });

            BlipController.add({
                pos: garage.position,
                color: 4,
                sprite: 50,
                scale: 1,
                shortRange: true,
                text: LocaleController.get(LOCALE_KEYS.GARAGE_BLIP_NAME),
            });

            MarkerController.append({
                uid: `marker-garage-${i}`,
                pos: new alt.Vector3(garage.position.x, garage.position.y, garage.position.z - 1),
                color: new alt.RGBA(0, 150, 0, 100),
                type: 1,
                maxDistance: 10,
                scale: { x: 2, y: 2, z: 3 },
            });
        }
    }

    static async open(player: alt.Player, shopIndex: number) {
        GarageUsers[player.id] = shopIndex;

        const garageType = DEFAULT_CONFIG.VEHICLE_GARAGES[shopIndex].type;
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

            // Check if Vehicle Type is null or undefined.
            // Basically means does this vehicle have a garage yet?
            if (vehicle.garageIndex === null || vehicle.garageIndex === undefined) {
                return true;
            }

            // Check if the garage index belongs to the vehicle if it's present.
            if (vehicle.garageIndex === shopIndex) {
                return true;
            }

            // Append vehicles that belong to the player to this list.
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

        alt.emitClient(player, View_Events_Garage.Open, validVehicles);
    }

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

    static findOpenSpot(parkingSpots: Array<PositionAndRotation>): PositionAndRotation {
        const spots = [...parkingSpots].sort(function () {
            return 0.5 - Math.random();
        });

        for (let i = 0; i < spots.length; i++) {
            const hash = sha256(JSON.stringify(spots[i]));

            // Parking spot is unused.
            if (!LastParkedCarSpawn[hash]) {
                return spots[i];
            }

            // Vehicle is no longer valid.
            if (LastParkedCarSpawn[hash] && !LastParkedCarSpawn[hash].valid) {
                return spots[i];
            }

            const vehicle = LastParkedCarSpawn[hash];
            const dist = distance2d(vehicle.pos, spots[i].position);

            // Parking Spot Open! Assumed...
            if (dist >= 5) {
                continue;
            }

            return spots[i];
        }

        return null;
    }

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
            alt.emitClient(player, View_Events_Garage.Close);
            return;
        }

        // Get the garage terminal information.
        const shopIndex = GarageUsers[player.id];
        const parkingSpots = DEFAULT_CONFIG.VEHICLE_GARAGES[shopIndex].parking;
        const openSpot = GarageFunctions.findOpenSpot(parkingSpots);
        if (!openSpot) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_PARKING_SPOTS));
            alt.emitClient(player, View_Events_Garage.Close);
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
        alt.emitClient(player, View_Events_Garage.Close);
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
        const garage = DEFAULT_CONFIG.VEHICLE_GARAGES[shopIndex];
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

alt.onClient(View_Events_Garage.Spawn, GarageFunctions.spawnVehicle);
alt.onClient(View_Events_Garage.Despawn, GarageFunctions.despawnVehicle);

GarageFunctions.init();
