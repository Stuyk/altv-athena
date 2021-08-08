import * as alt from 'alt-server';
import { CurrencyTypes } from '../../shared/enums/currency';

import { FACTION_PERMISSION_FLAGS, FACTION_STORAGE } from '../../shared/flags/FactionPermissionFlags';
import { IResponse } from '../../shared/interfaces/IResponse';
import { playerFuncs } from '../extensions/Player';
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
     * Change rank name for a rankIndex.
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
     * Set permission(s) for a specific rank.
     * Only the owner can append rank permission setting.
     * Anyone with the permission can change other(s) flags lower than themself.
     * @static
     * @param {alt.Player} player
     * @param {number} rankIndex
     * @param {FACTION_PERMISSION_FLAGS} number
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static async setRankPermissions(
        player: alt.Player,
        rankIndex: number,
        flags: FACTION_PERMISSION_FLAGS
    ): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS
        );

        const faction = FactionInternalSystem.get(player.data.faction);

        const wasAlreadySet = FactionInternalSystem.checkPermission(
            faction.ranks[rankIndex].permissions,
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS
        );

        const isSettingPerms = FactionInternalSystem.checkPermission(flags, FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS);

        if (!wasAlreadySet && isSettingPerms && faction.players[0].id !== player.data._id.toString()) {
            return { status: false, response: 'Only the owner can append rank permission(s) flag to a rank.' };
        }

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.setRankPermissions(player.data.faction, rankIndex, flags);
    }

    /**
     * Change the rank order based on rankIndex and a boolean.
     * @static
     * @param {alt.Player} player
     * @param {number} rankIndex
     * @param {boolean} [moveDown=false] Set to 'true' to move the rank down.
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static async changeRankOrder(player: alt.Player, rankIndex: number, moveDown: boolean = false): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_ORDER
        );

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.changeRankOrder(player.data.faction, rankIndex, moveDown);
    }

    /**
     * Set a member rank to a specific rank index.
     * @static
     * @param {alt.Player} player
     * @param {alt.Player} target
     * @param {number} rankIndex
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async setMemberRank(player: alt.Player, memberID: string, rankIndex: number): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CHANGE_MEMBER_RANK
        );

        if (!result.status) {
            return result;
        }

        return FactionInternalSystem.setMemberRank(player.data.faction, memberID, rankIndex);
    }

    /**
     * Change the name of the faction.
     * @static
     * @param {alt.Player} player
     * @param {string} name New name for the faction.
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async setFactionName(player: alt.Player, name: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
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

    /**
     * External callable function for opening faction storages.
     * @static
     * @param {alt.Player} player
     * @param {FACTION_STORAGE} storageName
     * @memberof FactionSystem
     */
    static async openStorage(player: alt.Player, storageName: FACTION_STORAGE): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        switch (storageName) {
            case FACTION_STORAGE.STORAGE: {
                const result = FactionInternalSystem.hasPermission(
                    player.data.faction,
                    player.data._id.toString(),
                    FACTION_PERMISSION_FLAGS.ACCESS_STORAGE
                );

                if (!result) {
                    return { status: false, response: 'Storage Not Accessible' };
                }

                break;
            }
            case FACTION_STORAGE.WEAPONS: {
                const result = FactionInternalSystem.hasPermission(
                    player.data.faction,
                    player.data._id.toString(),
                    FACTION_PERMISSION_FLAGS.ACCESS_WEAPONS
                );

                if (!result) {
                    return { status: false, response: 'Storage Not Accessible' };
                }

                break;
            }
            default: {
                return { status: false, response: 'Storage name does not exist.' };
            }
        }

        return FactionInternalSystem.openStorage(player, player.data.faction, storageName);
    }

    /**
     * Deposit money into a faction bank.
     * @static
     * @param {alt.Player} player Player who is depositing
     * @param {number} amount Amount to deposit
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async depositToBank(player: alt.Player, amount: number): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.ADD_TO_BANK
        );

        if (!result.status) {
            return result;
        }

        if (player.data.cash + player.data.bank < amount) {
            return { status: false, response: `Could not deposit ${amount}.` };
        }

        if (!playerFuncs.currency.subAllCurrencies(player, amount)) {
            return { status: false, response: `Could not deposit ${amount}.` };
        }

        return FactionInternalSystem.depositToBank(player.data.faction, amount);
    }

    /**
     * Withdraw money from a faction bank.
     * @static
     * @param {alt.Player} player Player who is depositing
     * @param {number} amount Amount to deposit
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async withdrawFromBank(player: alt.Player, amount: number): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.ADD_TO_BANK
        );

        if (!result.status) {
            return result;
        }

        const withdrawResult = await FactionInternalSystem.withdrawFromBank(player.data.faction, amount);
        if (!withdrawResult.status) {
            return { status: false, response: `Could not withdraw $${amount}.` };
        }

        if (!playerFuncs.currency.add(player, CurrencyTypes.CASH, amount)) {
            return { status: false, response: `Could not withdraw $${amount}.` };
        }

        return { status: true, response: `Withdrew $${amount}.` };
    }
}
