import * as alt from 'alt-server';
import { CurrencyTypes } from '../../shared/enums/currency';

import { FACTION_PERMISSION_FLAGS, FACTION_STORAGE } from '../../shared/flags/factionPermissionFlags';
import { IResponse } from '../../shared/interfaces/iResponse';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
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
            FACTION_PERMISSION_FLAGS.ADD_MEMBERS,
        );

        if (!result.status) {
            return result;
        }

        // Finish Adding Member
        const response = await FactionInternalSystem.addMember(player.data.faction, target);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.KICK_MEMBER,
        );

        if (!result.status) {
            return result;
        }

        // Finish Adding Member
        const response = await FactionInternalSystem.removeMember(player.data.faction, targetID);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CREATE_RANK,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.addRank(player.data.faction, rankName);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CREATE_RANK,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.removeRank(player.data.faction);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_NAMES,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.setRankName(player.data.faction, rankIndex, name);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
        flags: FACTION_PERMISSION_FLAGS,
    ): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionInternalSystem.hasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS,
        );

        const faction = FactionInternalSystem.get(player.data.faction);

        const wasAlreadySet =
            FactionInternalSystem.checkPermission(
                faction.ranks[rankIndex].permissions,
                FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS,
            ) ||
            FactionInternalSystem.checkPermission(
                faction.ranks[rankIndex].permissions,
                FACTION_PERMISSION_FLAGS.SUPER_ADMIN,
            );

        const isSettingPerms =
            FactionInternalSystem.checkPermission(flags, FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS) ||
            FactionInternalSystem.checkPermission(flags, FACTION_PERMISSION_FLAGS.SUPER_ADMIN);

        if (!wasAlreadySet && isSettingPerms && faction.players[0].id !== player.data._id.toString()) {
            return {
                status: false,
                response: 'Only the owner can append rank permission(s) or super admin flag to a rank.',
            };
        }

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.setRankPermissions(player.data.faction, rankIndex, flags);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_ORDER,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.changeRankOrder(player.data.faction, rankIndex, moveDown);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CHANGE_MEMBER_RANK,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.setMemberRank(player.data.faction, memberID, rankIndex);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CHANGE_NAME,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.setName(player.data.faction, name);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.CHANGE_NAME,
        );

        if (!result.status) {
            return result;
        }

        const response = await FactionInternalSystem.setName(player.data.faction, name);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NO_ACCESS));
            return validateResponse;
        }

        switch (storageName) {
            case FACTION_STORAGE.STORAGE: {
                const result = FactionInternalSystem.hasPermission(
                    player.data.faction,
                    player.data._id.toString(),
                    FACTION_PERMISSION_FLAGS.ACCESS_STORAGE,
                );

                if (!result) {
                    playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NO_ACCESS));
                    return {
                        status: false,
                        response: LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NOT_ACCESSIBLE),
                    };
                }

                break;
            }
            case FACTION_STORAGE.WEAPONS: {
                const result = FactionInternalSystem.hasPermission(
                    player.data.faction,
                    player.data._id.toString(),
                    FACTION_PERMISSION_FLAGS.ACCESS_WEAPONS,
                );

                if (!result) {
                    playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NO_ACCESS));
                    return {
                        status: false,
                        response: LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NOT_ACCESSIBLE),
                    };
                }

                break;
            }
            default: {
                playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NO_ACCESS));
                return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_STORAGE_NOT_ACCESSIBLE) };
            }
        }

        const response = await FactionInternalSystem.openStorage(player, player.data.faction, storageName);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.ADD_TO_BANK,
        );

        if (!result.status) {
            return result;
        }

        if (player.data.cash + player.data.bank < amount) {
            return {
                status: false,
                response: LocaleController.get(LOCALE_KEYS.FACTION_BANK_COULD_NOT_DEPOSIT, amount),
            };
        }

        if (!playerFuncs.currency.subAllCurrencies(player, amount)) {
            return {
                status: false,
                response: LocaleController.get(LOCALE_KEYS.FACTION_BANK_COULD_NOT_DEPOSIT, amount),
            };
        }

        const response = await FactionInternalSystem.depositToBank(player.data.faction, amount);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
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
            FACTION_PERMISSION_FLAGS.ADD_TO_BANK,
        );

        if (!result.status) {
            return result;
        }

        const withdrawResult = await FactionInternalSystem.withdrawFromBank(player.data.faction, amount);
        if (!withdrawResult.status) {
            return {
                status: false,
                response: LocaleController.get(LOCALE_KEYS.FACTION_BANK_COULD_NOT_WITHDRAW, amount),
            };
        }

        if (!playerFuncs.currency.add(player, CurrencyTypes.CASH, amount)) {
            return {
                status: false,
                response: LocaleController.get(LOCALE_KEYS.FACTION_BANK_COULD_NOT_WITHDRAW, amount),
            };
        }

        const response = { status: true, response: LocaleController.get(LOCALE_KEYS.FACTION_BANK_WITHDREW, amount) };
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
    }

    /**
     * Disband and delete the faction.
     * @static
     * @param {alt.Player} player
     * @param {string} factionName
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static async disband(player: alt.Player, factionName: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const faction = FactionInternalSystem.get(player.data.faction);
        if (!faction) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULD_NOT_FIND) };
        }

        if (faction.players[0].id !== player.data._id.toString()) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_UNABLE_TO_DISBAND) };
        }

        if (faction.name !== factionName) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_NAME_DOESNT_MATCH) };
        }

        await FactionInternalSystem.disband(player.data.faction);
        return { status: true, response: LocaleController.get(LOCALE_KEYS.FACTION_DISABNDED) };
    }

    /**
     * Change ownership of the faction to someone else.
     * Requires owner permission.
     * @static
     * @param {alt.Player} player
     * @param {string} characterID
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static async changeOwner(player: alt.Player, characterID: string): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const faction = FactionInternalSystem.get(player.data.faction);
        if (!faction) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULD_NOT_FIND) };
        }

        if (faction.players[0].id !== player.data._id.toString()) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_CANNOT_CHANGE_OWNERSHIP) };
        }

        const response = await FactionInternalSystem.handOffFaction(player.data.faction, characterID, false);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
    }

    static async setStorageLocation(player: alt.Player): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const faction = FactionInternalSystem.get(player.data.faction);
        if (!faction) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULD_NOT_FIND) };
        }

        if (faction.players[0].id !== player.data._id.toString()) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_NOT_THE_OWNER) };
        }

        const response = await FactionInternalSystem.setStorageLocation(player.data.faction, player.pos);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
    }

    static async setWeaponsLocation(player: alt.Player): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const faction = FactionInternalSystem.get(player.data.faction);
        if (!faction) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULD_NOT_FIND) };
        }

        if (faction.players[0].id !== player.data._id.toString()) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_NOT_THE_OWNER) };
        }

        const response = await FactionInternalSystem.setWeaponsLocation(player.data.faction, player.pos);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
    }

    static async setPosition(player: alt.Player): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const faction = FactionInternalSystem.get(player.data.faction);
        if (!faction) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULD_NOT_FIND) };
        }

        if (faction.players[0].id !== player.data._id.toString()) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_NOT_THE_OWNER) };
        }

        const response = await FactionInternalSystem.setPosition(player.data.faction, player.pos);
        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
    }

    /**
     * Used to leave the faction.
     * @static
     * @param {alt.Player} player
     * @memberof FactionSystem
     */
    static async leave(player: alt.Player): Promise<IResponse> {
        const validateResponse = FactionInternalSystem.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        const faction = FactionInternalSystem.get(player.data.faction);
        if (!faction) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULD_NOT_FIND) };
        }

        if (faction.players[0].id === player.data._id.toString()) {
            return { status: false, response: LocaleController.get(LOCALE_KEYS.FACTION_COULDNT_QUIT) };
        }

        const response = await FactionInternalSystem.removeMember(player.data.faction, player.data._id.toString());

        if (response.status) {
            response.response = LocaleController.get(LOCALE_KEYS.FACTION_PLAYER_QUITTED, player.data.name);
        }

        FactionInternalSystem.log(player.data.faction, player.data._id.toString(), response.status, response.response);
        return response;
    }
}
