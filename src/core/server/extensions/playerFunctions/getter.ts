import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { IVehicle } from '../../../shared/interfaces/iVehicle';
import { Collections } from '../../interface/DatabaseCollections';
import VehicleFuncs from '../VehicleFuncs';

/**
 * Get all the vehicles that belong to this player.
 * Also gets vehicles based on key items.
 * @param {alt.Player} player
 * @return {Promise<IVehicle[]>}
 */
async function allVehicles(player: alt.Player, excludeKeys = false): Promise<IVehicle[]> {
    let vehicles = await Database.fetchAllByField<IVehicle>(`owner`, player.data._id.toString(), Collections.Vehicles);

    if (!excludeKeys) {
        const keys = VehicleFuncs.getAllVehicleKeys(player);
        if (keys.length >= 1) {
            const keyedVehicles = await VehicleFuncs.getValidVehicleIDsFromKeys(keys);
            vehicles = vehicles.concat(keyedVehicles);
        }
    }

    return vehicles;
}

export default {
    allVehicles,
};
