import * as alt from 'alt-server';
import { Vector3 } from '../../shared/interfaces/Vector';
import { Vehicle } from '../../shared/interfaces/Vehicle';
import { distance2d, getClosestVector } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { vehicleFuncs } from '../extensions/Vehicle';
import { BlipController } from '../systems/blip';
import { InteractionController } from '../systems/interaction';
import { sha256 } from '../utility/encryption';

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
        // alt.emitClient...
        GarageUsers[player.id] = shopIndex;
        alt.log(`Garage Index: ${shopIndex}`);

        // Temp Function
        GarageFunctions.spawnVehicle(player, 0);
    }

    static findOpenSpot(parkingSpots: Array<PositionAndRotation>): PositionAndRotation {
        for (let i = 0; i < parkingSpots.length; i++) {
            const hash = sha256(JSON.stringify(parkingSpots[i]));

            if (!LastParkedCarSpawn[hash]) {
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

    static spawnVehicle(player: alt.Player, index: number) {
        if (!player.data.vehicles) {
            return;
        }

        if (!player.data.vehicles[index]) {
            return;
        }

        const data = player.data.vehicles[index] as Vehicle;
        const vehicle = alt.Vehicle.all.find((veh) => veh && veh.data && veh.data.uid === data.uid);
        if (vehicle) {
            // Cannot spawn because it already is spawned. Go find it nerd.
            return;
        }

        const shopIndex = GarageUsers[player.id];
        const parkingSpots = DEFAULT_CONFIG.VEHICLE_GARAGES[shopIndex].parking;

        const openSpot = GarageFunctions.findOpenSpot(parkingSpots);
        if (!openSpot) {
            return;
        }

        const hash = sha256(JSON.stringify(openSpot));
        LastParkedCarSpawn[hash] = vehicleFuncs.new.spawn(player, data, openSpot.position, openSpot.rotation);
    }

    static storeVehicle(player: alt.Player, index: number) {
        if (!player.data.vehicles) {
            return;
        }

        if (!player.data.vehicles[index]) {
            return;
        }

        const identifier = player.data.vehicles[index].uid;
        const vehicle = alt.Vehicle.all.find((veh) => veh && veh.data && veh.data.uid === identifier);
        if (!vehicle) {
            return;
        }

        vehicleFuncs.new.despawn(vehicle.id, player);
    }
}

GarageFunctions.init();
