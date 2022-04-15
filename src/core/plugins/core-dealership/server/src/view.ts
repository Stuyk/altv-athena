import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { VEHICLE_CLASS } from '../../../../shared/enums/vehicleTypeFlags';
import { VehicleData } from '../../../../shared/information/vehicles';
import { VehicleInfo } from '../../../../shared/interfaces/vehicleInfo';
import { DEALERSHIP_EVENTS } from '../../shared/events';
import { IDealership } from '../../shared/interfaces';

const dealerships: Array<IDealership> = [];
let inDealership: { [key: string]: string } = {};

class InternalFunctions {
    /**
     * It creates a blip, marker, and interaction for a dealership
     * @param {IDealership} dealership - IDealership - This is the dealership object that is being
     * passed to the function.
     */
    static propogate(dealership: IDealership) {
        Athena.controllers.interaction.add({
            uid: dealership.uid,
            description: `Has Vehicles In It`,
            isPlayerOnly: true,
            position: dealership.pos,
            range: 3,
            callback: (player: alt.Player) => {
                DealershipView.load(player, dealership);
            },
        });

        Athena.controllers.blip.append({
            uid: dealership.uid,
            color: 43, // Light Green
            text: dealership.uid,
            pos: dealership.pos,
            shortRange: true,
            scale: 1,
            sprite: 669,
        });

        Athena.controllers.marker.append({
            uid: dealership.uid,
            type: 36,
            color: new alt.RGBA(0, 255, 0, 100),
            pos: new alt.Vector3(dealership.pos.x, dealership.pos.y, dealership.pos.z + 0.5),
            maxDistance: 10,
            scale: new alt.Vector3(1, 1, 1),
        });
    }
}

export class DealershipView {
    static init() {
        alt.onClient(DEALERSHIP_EVENTS.PURCHASE, DealershipView.purchase);
        alt.onClient(DEALERSHIP_EVENTS.EXIT, DealershipView.exit);
    }

    /**
     * Add a dealership to the dealerships array and then propogate the dealership to the other
     * functions.
     * @param {IDealership} dealership - IDealership - This is the dealership that is being added to
     * the list.
     */
    static add(dealership: IDealership) {
        dealerships.push(dealership);
        InternalFunctions.propogate(dealership);
    }

    /**
     * If the dealership exists, remove it from the array and return true, otherwise return false.
     * @param {string} uid - string - The unique identifier of the dealership to remove.
     * @returns The return value is a boolean.
     */
    static remove(uid: string): boolean {
        const index = dealerships.findIndex((dealership) => dealership.uid === uid);
        if (index <= -1) {
            return false;
        }

        dealerships.splice(index, 1);
        return true;
    }

    /**
     * It takes a dealership object and loads it into the player's client.
     * @param player - The player who is interacting with the dealership.
     * @param {IDealership} dealership - IDealership
     */
    static load(player: alt.Player, dealership: IDealership) {
        alt.emitClient(player, DEALERSHIP_EVENTS.LOAD, dealership);
        inDealership[player.id] = dealership.uid;
    }

    static purchase(player: alt.Player, vehicle: VehicleInfo) {
        //
    }

    static exit(player: alt.Player) {
        //
    }
}

const dealership: IDealership = {
    uid: 'dealership-1',
    vehiclePosition: { x: -653.681640625, y: -967.2091674804688, z: 20.7 },
    cam: { x: -650.1626586914062, y: -963.4005126953125, z: 21.293882369995117 },
    pos: { x: -643.3508911132812, y: -972.0877685546875, z: 20.7 },
    vehicles: VehicleData.filter((x) => x.class === VEHICLE_CLASS.MUSCLE && x.sell),
};

DealershipView.add(dealership);
DealershipView.init();
