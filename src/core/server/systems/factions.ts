import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';
import { FactionMember, IFaction, FactionRank } from '../../shared/interfaces/IFaction';
import { FACTION_PERMISSION_FLAGS } from '../../shared/flags/FactionPermissionFlags';
import { playerFuncs } from '../extensions/Player';
import { isFlagEnabled } from '../../shared/utility/flags';

let factions: { [key: string]: IFaction } = {};

interface Response {
    status: boolean;
    response: string;
}

/**
 * Factions are not instance based. We simply don't need a class for Faction(s).
 * Faction cache is updated in the 'factions' variable above.
 * Faction modifications are then updated.
 * @export
 * @class FactionSystem
 */
export class FactionSystem {
    static async init() {
        const factions = await Database.fetchAllData(Collections.Factions);
        if (!factions || !Array.isArray(factions)) {
            Logger.warning(`You have not created any factions.`);
            return;
        }

        for (let i = 0; i < factions.length; i++) {
            FactionSystem.setup(factions[i]);
        }
    }

    /**
     * Does general setup for the faction.
     * Also looks up vehicles and spawns them.
     * @static
     * @param {IFaction} faction
     * @memberof FactionSystem
     */
    static async setup(faction: IFaction) {
        faction._id = faction._id.toString();

        if (!faction.ranks) {
            faction.ranks = [{ name: 'Admin', permissions: FACTION_PERMISSION_FLAGS.SUPER_ADMIN }];
        }

        if (faction.pos) {
            // Create Blip
        }

        if (faction.storageLocation) {
            // Create Interaction
        }

        if (faction.weaponLocation) {
            // Create Interaction
        }

        if (faction.bank === undefined || faction.bank === null) {
            faction.bank = 0;
        }

        factions[faction._id as string] = faction;

        // When spawning vehicles just go edit vehicle system
        // Skip last used for faction vehicles
    }

    /**
     * Save part of faction data to the database.
     * @static
     * @param {string} id
     * @param {Partial<IFaction>} data
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    private static async systemSave(id: string, data: Partial<IFaction>): Promise<boolean> {
        return await Database.updatePartialData(id, { ...data }, Collections.Factions);
    }

    /**
     * Validate if player data is currently valid.
     * Checks for faction validity and player validity.
     * @private
     * @static
     * @param {alt.Player} player
     * @return {*}  {Response}
     * @memberof FactionSystem
     */
    private static validatePlayer(player: alt.Player): Response {
        if (!player || !player.valid || !player.data.faction) {
            return { status: false, response: 'You are not currently in a faction.' };
        }

        if (!factions[player.data.faction]) {
            player.data.faction = null;
            playerFuncs.save.field(player, 'faction', null);
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        return { status: true, response: null };
    }

    /**
     * Get the member from the faction if it exists.
     * @static
     * @param {string} id
     * @param {string} characterID
     * @return {FactionMember | null}
     * @memberof FactionSystem
     */
    static getMember(id: string, characterID: string): FactionMember {
        return factions[id].players.find((member) => member.id === characterID);
    }

    /**
     * Get the rank associated with a faction member.
     * @static
     * @param {string} id
     * @param {FactionMember} member
     * @return {FactionRank | null}
     * @memberof FactionSystem
     */
    static getRankFromMember(id: string, member: FactionMember): FactionRank {
        return factions[id].ranks[member.rank];
    }

    /**
     * Check if the player has the specified permission(s)
     * @static
     * @param {string} id The faction id of a player
     * @param {string} playerID The character id of a player
     * @param {FACTION_PERMISSION_FLAGS} flag
     * @return {*}  {Promise<Response>}
     * @memberof FactionSystem
     */
    static systemHasPermission(id: string, characterID: string, flags: FACTION_PERMISSION_FLAGS): Response {
        const member = FactionSystem.getMember(id, characterID);
        const rank = FactionSystem.getRankFromMember(id, member);

        if (isFlagEnabled(rank.permissions, FACTION_PERMISSION_FLAGS.SUPER_ADMIN)) {
            return { status: true, response: 'Completed Action' };
        }

        const result = isFlagEnabled(rank.permissions, flags);
        if (!result) {
            return { status: result, response: 'You do not have permission to perform this action.' };
        }

        return { status: result, response: 'Completed action.' };
    }

    /**
     * External callable function for adding a member from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {(alt.Player | string)} target
     * @return {*}  {Promise<Response>}
     * @memberof FactionSystem
     */
    static async addMember(player: alt.Player, target: alt.Player | string): Promise<Response> {
        const validateResponse = this.validatePlayer(player);
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
        const result = FactionSystem.systemHasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.ADD_MEMBERS
        );

        if (!result.status) {
            return result;
        }

        // Finish Adding Member
        return FactionSystem.systemAddMember(player.data.faction, target);
    }

    /**
     * Add a member to the faction.
     * @static
     * @param {string} id
     * @param {alt.Player} target
     * @return {*}  {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async systemAddMember(id: string, target: alt.Player): Promise<Response> {
        if (!target || !target.valid || !target.data) {
            return { status: false, response: 'Target player does not exist.' };
        }

        if (!factions[id]) {
            return { status: false, response: 'The faction ID specified does not exist.' };
        }

        const memberIndex = factions[id].players.findIndex((member) => member.id === target.data._id.toString());
        if (memberIndex >= 0) {
            return { status: true, response: 'Target player is already in this faction.' };
        }

        const lastRankInFaction = factions[id].ranks.length - 1;
        factions[id].players.push({ id: target.data._id.toString(), name: target.data.name, rank: lastRankInFaction });
        await this.systemSave(id, { players: factions[id].players });
        return { status: true, response: 'Target player was added to the faction.' };
    }

    /**
     * External callable function for removing a member from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {string} target
     * @return {*}  {Promise<Response>}
     * @memberof FactionSystem
     */
    static async removeMember(player: alt.Player, targetID: string): Promise<Response> {
        const validateResponse = this.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionSystem.systemHasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.KICK_MEMBER
        );

        if (!result.status) {
            return result;
        }

        // Finish Adding Member
        return FactionSystem.systemRemoveMember(player.data.faction, targetID);
    }

    /**
     * Remove a member from this faction based on their character id.
     * @static
     * @param {string} id
     * @param {string} characterID
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async systemRemoveMember(id: string, characterID: string): Promise<Response> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        const memberIndex = factions[id].players.findIndex((member) => member.id === characterID);
        if (memberIndex <= -1) {
            return { status: false, response: 'Target player is not in your faction.' };
        }

        factions[id].players.splice(memberIndex, 1);
        await this.systemSave(id, { players: factions[id].players });
        return { status: true, response: 'Target player was removed from your faction.' };
    }

    /**
     * External callable function for adding a rank from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {string} rankName Name of the Rank
     * @return {*}  {Promise<Response>}
     * @memberof FactionSystem
     */
    static async addRank(player: alt.Player, rankName: string): Promise<Response> {
        const validateResponse = this.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionSystem.systemHasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CREATE_RANK
        );

        if (!result.status) {
            return result;
        }

        return FactionSystem.systemAddRank(player.data.faction, rankName);
    }

    /**
     * Add a rank to a faction.
     * @static
     * @param {string} id FactionID
     * @param {string} rankName Name of New Rank
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async systemAddRank(id: string, rankName: string): Promise<Response> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        factions[id].ranks.push({ name: rankName, permissions: 0 });
        await this.systemSave(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${rankName} was created.` };
    }

    /**
     * External callable function for removing a rank from an interface or command.
     * @static
     * @param {alt.Player} player
     * @param {number} rankIndex Index in Rank Array
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async removeRank(player: alt.Player, rankIndex: number): Promise<Response> {
        const validateResponse = this.validatePlayer(player);
        if (!validateResponse.status) {
            return validateResponse;
        }

        // Check Permission System
        const result = FactionSystem.systemHasPermission(
            player.data.faction,
            player.data._id.toString(),
            FACTION_PERMISSION_FLAGS.CREATE_RANK
        );

        if (!result.status) {
            return result;
        }

        return FactionSystem.systemRemoveRank(player.data.faction, rankIndex);
    }

    /**
     * Remove a rank based on index from a faction.
     * @static
     * @param {string} id FactionID
     * @param {number} rankIndex Index in Rank Array
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async systemRemoveRank(id: string, rankIndex: number): Promise<Response> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: `Faction rank ${rankIndex} does not exist.` };
        }

        factions[id].ranks.splice(rankIndex, 1);
        await this.systemSave(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank Index ${rankIndex} was removed.` };
    }
}
