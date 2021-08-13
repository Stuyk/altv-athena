import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { IVehicle } from '../../../shared/interfaces/IVehicle';
import { Collections } from '../../interface/DatabaseCollections';

/**
 * Get all the vehicles that belong to this player.
 * @param {alt.Player} player
 * @return {*}  {Promise<IVehicle[]>}
 */
async function allVehicles(player: alt.Player): Promise<IVehicle[]> {
    return await Database.fetchAllByField(`owner`, player.data._id.toString(), Collections.Vehicles);
}

export default {
    allVehicles
};
