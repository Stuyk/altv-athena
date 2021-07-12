import * as alt from 'alt-server';
import { Vector3 } from '../../shared/interfaces/Vector';
import { Vehicle } from '../../shared/interfaces/Vehicle';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { vehicleFuncs } from '../extensions/Vehicle';
import { BlipController } from '../systems/blip';
import { InteractionController } from '../systems/interaction';
import { sha256 } from '../utility/encryption';
import { View_Events_Garage } from '../../shared/enums/views';
import { playerFuncs } from '../extensions/Player';

const GarageUsers = {};
const LastParkedCarSpawn: { [key: string]: alt.Vehicle } = {};

interface PositionAndRotation {
    position: Vector3;
    rotation: Vector3;
}

class GarageFunctions {
    static init() {
        const garages = [...DEFAULT_CONFIG.VEHICLE_GARAGES];

        for (let i = 0; i < garages.length; i++) {
            const garage = garages[i];

            InteractionController.add({
                position: garage.position,
                description: 'Browse Player Owned Vehicles',
                type: 'garage',
                data: [i], // Shop Index
                callback: GarageFunctions.open
            });

            BlipController.add({
                pos: garage.position,
                color: 4,
                sprite: 50,
                scale: 1,
                shortRange: true,
                text: 'Vehicle Garage'
            });
        }
    }

    static open(player: alt.Player, shopIndex: number) {
        GarageUsers[player.id] = shopIndex;

        const validVehicles = player.data.vehicles.filter((x) => {
            if (x.garageIndex === null || x.garageIndex === undefined) {
                return true;
            }

            if (x.garageIndex === shopIndex) {
                return true;
            }

            // Append vehicles that belong to the player to this list.
            const vehicle = alt.Vehicle.all.find((ref) => ref && ref.data && ref.data.uid === x.uid);
            if (vehicle) {
                return true;
            }

            return false;
        });

        if (validVehicles.length <= 0) {
            playerFuncs.emit.notification(player, `~r~You have no vehicles at this garage.`);
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
        for (let i = 0; i < parkingSpots.length; i++) {
            const hash = sha256(JSON.stringify(parkingSpots[i]));

            // Parking spot is unused.
            if (!LastParkedCarSpawn[hash]) {
                return parkingSpots[i];
            }

            // Vehicle is no longer valid.
            if (LastParkedCarSpawn[hash] && !LastParkedCarSpawn[hash].valid) {
                return parkingSpots[i];
            }

            const vehicle = LastParkedCarSpawn[hash];
            const dist = distance2d(vehicle.pos, parkingSpots[i].position);

            // Parking Spot Open! Assumed...
            if (dist >= 5) {
                continue;
            }

            return parkingSpots[i];
        }

        return null;
    }

    static spawnVehicle(player: alt.Player, uid: string) {
        if (!player || !player.valid || !player.data) {
            return;
        }

        if (!player.data.vehicles) {
            return;
        }

        const data = player.data.vehicles.find((ref) => ref.uid === uid) as Vehicle;
        if (!data) {
            return;
        }

        const vehicle = alt.Vehicle.all.find((ref) => ref && ref.data && ref.data.uid === data.uid);
        if (vehicle) {
            return;
        }

        // Get the garage terminal information.
        const shopIndex = GarageUsers[player.id];
        const parkingSpots = DEFAULT_CONFIG.VEHICLE_GARAGES[shopIndex].parking;
        const openSpot = GarageFunctions.findOpenSpot(parkingSpots);
        if (!openSpot) {
            return;
        }

        // Create and store the vehicle on the hashed vehicle parking spot.
        const hash = sha256(JSON.stringify(openSpot));
        LastParkedCarSpawn[hash] = vehicleFuncs.new.spawn(player, data, openSpot.position, openSpot.rotation);
    }

    static despawnVehicle(player: alt.Player, uid: string) {
        if (!player || !player.valid || !player.data) {
            return;
        }

        if (!player.data.vehicles) {
            return;
        }

        // Check that the vehicle belongs to the player.
        const data = player.data.vehicles.find((ref) => ref.uid === uid);
        if (!data) {
            return;
        }

        // Check that the vehicle is currently spawned.
        const vehicle = alt.Vehicle.all.find((ref) => ref && ref.data && ref.data.uid === data.uid);
        if (!vehicle) {
            return;
        }

        // Get the garage garage information, and position.
        // Determine if the vehicle is close enough to the garage.
        const shopIndex = GarageUsers[player.id];
        const garage = DEFAULT_CONFIG.VEHICLE_GARAGES[shopIndex];
        const dist = distance2d(vehicle.pos, garage.position);

        // Check if the vehicle is either close to a parking spot or the garage itself.
        if (dist >= 10 && !GarageFunctions.isCloseToSpot(vehicle.pos, garage.parking)) {
            playerFuncs.emit.message(player, 'Vehicle is too far away or whatever the fuck.');
            return;
        }

        // Set the garage index.
        vehicle.data.garageIndex = shopIndex;
        vehicleFuncs.save.data(player, vehicle);

        // After setting the garage index. Despawn the vehicle.
        vehicleFuncs.new.despawn(vehicle.id, player);
    }
}

alt.onClient(View_Events_Garage.Spawn, GarageFunctions.spawnVehicle);
alt.onClient(View_Events_Garage.Despawn, GarageFunctions.despawnVehicle);

GarageFunctions.init();
