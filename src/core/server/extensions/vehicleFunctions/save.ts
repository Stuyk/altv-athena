import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Vehicle_Behavior } from '../../../shared/enums/vehicle';
import { Vehicle } from '../../../shared/interfaces/Vehicle';
import { isFlagEnabled } from '../../../shared/utility/flags';

const db: Database = getDatabase();

/**
 * Save vehicle data that is currently stored on the vehicle.
 * @param {string} fieldName
 * @param {*} fieldValue
 * @return {*}  {Promise<void>}
 * @memberof SavePrototype
 */
async function data(player: alt.Player, vehicle: alt.Vehicle): Promise<void> {
    if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_SAVE)) {
        return;
    }

    if (process.env.TEST) {
        return;
    }

    if (!vehicle.data) {
        return;
    }

    const vehicleData = player.data.vehicles.find((v) => v.uid === vehicle.data.uid);
    if (!vehicleData) {
        vehicle.destroy();
        return;
    }

    vehicle.data.position = vehicle.pos;
    vehicle.data.rotation = vehicle.rot;
    vehicle.data.fuel = vehicle.fuel;
}

export default {
    data
};
