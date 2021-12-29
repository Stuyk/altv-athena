import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { IVehicle } from '../../../shared/interfaces/iVehicle';
import { Collections } from '../../interface/DatabaseCollections';
import VehicleFuncs from '../VehicleFuncs';
import { Character } from '../../../shared/interfaces/character';

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

/**
 * Returns the unique account id associated with this player.
 * Keep in mind that you should not use this id to save data to the database.
 * @param {alt.Player} player
 * @return {number}
 */
function uid(player: alt.Player): number {
    if (!player.accountData) {
        return -1;
    }

    return player.accountData.id;
}

/**
 * Get all characters associated with a player.
 * @param {alt.Player} player
 * @return {Promise<Array<Character>>}
 */
async function allCharacters(player: alt.Player): Promise<Array<Character>> {
    return await Database.fetchAllByField('account_id', player.accountData._id, Collections.Characters);
}

export default {
    allCharacters,
    allVehicles,
    uid,
};
