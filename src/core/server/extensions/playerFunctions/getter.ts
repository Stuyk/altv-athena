import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { IVehicle } from '@AthenaShared/interfaces/iVehicle';
import { Collections } from '@AthenaServer/interface/iDatabaseCollections';
import { Character } from '@AthenaShared/interfaces/character';
import VehicleFuncs from '../vehicleFuncs';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { getters } from '@AthenaServer/systems/getters';
import { Athena } from '@AthenaServer/api/athena';

const Getter = {
    /**
     * Get all the vehicles that belong to this player.
     * Also gets vehicles based on key items.
     * @param {alt.Player} player
     * @return {Promise<IVehicle[]>}
     */
    async allVehicles(player: alt.Player): Promise<IVehicle[]> {
        const data = Athena.document.character.get(player);
        let vehicles = await Database.fetchAllByField<IVehicle>(`owner`, data._id.toString(), Collections.Vehicles);
        return vehicles;
    },

    /**
     * Get all characters associated with a player.
     * @deprecated Use `Athena.get.player.characters`
     *
     * @param {alt.Player} player
     * @return {Promise<Array<Character>>}
     */
    async allCharacters(player: alt.Player): Promise<Array<Character>> {
        return getters.player.characters(player);
    },

    /**
     * Returns an array of players filtered by permission level.
     * @export
     * @param {Array<Permissions>} permissionLevels An array of 'PERMISSIONS.x' levels.
     * @return {Array<alt.Player>}
     */
    playersByPermissionLevel(permissionLevels: Array<PERMISSIONS>): Array<alt.Player> {
        const validPlayers = [...alt.Player.all].filter((player) => {
            if (!player || !player.valid) {
                return false;
            }

            const accountData = Athena.document.account.get(player);
            if (!accountData) {
                return false;
            }

            return permissionLevels.includes(accountData.permissionLevel);
        });

        return validPlayers;
    },
    /**
     * Returns the closest player in our grid space.
     * @deprecated Use `Athena.get.player.closestToPlayer`
     *
     * @export
     * @param {alt.Player} player
     * @return {alt.Player}
     */
    closestPlayer(player: alt.Player): alt.Player {
        return getters.player.closestToPlayer(player);
    },
};

/**
 * It takes a function name and a callback, and if the function name exists in the funcs object, it
 * overrides it with the callback
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the player calls the getter.
 */
function override<Key extends keyof typeof Getter>(functionName: Key, callback: typeof Getter[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.get does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

const funcs: typeof Getter & { override?: typeof override } = {
    ...Getter,
    override,
};

export default funcs;
