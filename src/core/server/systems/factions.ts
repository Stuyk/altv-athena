import * as alt from 'alt-server';

import { FACTION_PERMISSION_FLAGS } from '../../shared/flags/FactionPermissionFlags';
import { IResponse } from '../../shared/interfaces/IResponse';
import { FactionInternalSystem } from './factionsInternal';

/**
 * Factions are not instance based. We simply don't need a class for Faction(s).
 * Faction cache is updated in the 'factions' variable in the internal factions system
 * These functions are for verifying faction action(s).
 * @export
 * @class FactionSystem
 */
export class FactionSystem {
    /**
     * External callable function for adding a member from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {(alt.Player | string)} target
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static async addMember(player: alt.Player, target: alt.Player | string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        if (typeof target === 'string') {
            target = alt.Player.all.find((p) => p && p.valid && p.data && p.data._id.toString() === target);
        }

        // Check the target exists, and doesn't have a faction.
        if (!target || !target.data || target.data.faction) {
            return { status: false, response: `${target.data.name} is already in a faction or does not exist.` };
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.ADD_MEMBERS
        );

        if (!result.status) {
            return result;
        }

        // Finish Adding Member
        return FactionInternalSystem.addMember(player.data.faction, target);
    }

    /**
     * External callable function for removing a member from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {string} target
     * @return {*}  {Promise<Response>}
     * @memberof FactionSystem
     */
    static async removeMember(player: alt.Player, targetID: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.KICK_MEMBER
        );

        if (!result.status) {
            return result;
        }

        // Finish Adding Member
        return FactionInternalSystem.removeMember(player.data.faction, targetID);
    }

    /**
     * External callable function for adding a rank from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {string} rankName Name of the Rank
     * @return {*}  {Promise<Response>}
     * @memberof FactionSystem
     */
    static async addRank(player: alt.Player, rankName: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CREATE_RANK
        );

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.addRank(player.data.faction, rankName);
    }

    /**
     * External callable function for removing a rank from an interface or command.
     * Removes the last rank in the rank list.
     * @static
     * @param {alt.Player} player
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async removeRank(player: alt.Player): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CREATE_RANK
        );

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.removeRank(player.data.faction);
    }

    /**
     * External callable function for setting a rank name by index.
     * @static
     * @param {alt.Player} player
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async setRankName(player: alt.Player, rankIndex: number, name: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_NAMES
        );

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.setRankName(player.data.faction, rankIndex, name);
    }

    /**
     * External callable function to set the name for a faction.
     * @static
     * @param {alt.Player} player
     * @param {string} name Name to Set
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async setName(player: alt.Player, name: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CHANGE_NAME
        );

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.setName(player.data.faction, name);
    }
}
