import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { FACTION_PERMISSION_FLAGS, FACTION_STORAGE } from '../../shared/flags/FactionPermissionFlags';
import { FactionMember, FactionRank, IFaction } from '../../shared/interfaces/IFaction';
import { IResponse } from '../../shared/interfaces/IResponse';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';
import { StorageView } from '../views/storage';
import { StorageSystem } from './storage';

let factions: { [key: string]: IFaction } = {};

/**
 * Feature List:
 * *set faction name
 * *add member
 * *remove member
 * *add rank
 * *set member rank
 * *remove rank
 * *change rank order
 * *change rank name
 * *change rank permission
 * *storage access (supports 'bank', 'storage', and 'weapons')
 * *remove from bank
 * *add to bank
 * refresh menu for players who have it open
 */

export class FactionInternalSystem {
    static async init() {
        const factions = await Database.fetchAllData(Collections.Factions);
        if (!factions || !Array.isArray(factions)) {
            Logger.warning(`You have not created any factions.`);
            return;
        }

        for (let i = 0; i < factions.length; i++) {
            FactionInternalSystem.setup(factions[i]);
        }
    }

    /**
     * Get a faction from cache.
     * @static
     * @param {string} id
     * @return {*}
     * @memberof FactionInternalSystem
     */
    static async get(id: string) {
        return factions[id];
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
    private static async save(id: string, data: Partial<IFaction>): Promise<boolean> {
        return await Database.updatePartialData(id, { ...data }, Collections.Factions);
    }

    /**
     * Validate if player data is currently valid.
     * Checks for faction validity and player validity.
     * @private
     * @static
     * @param {alt.Player} player
     * @return {IResponse}
     * @memberof FactionSystem
     */
    static validatePlayer(player: alt.Player): IResponse {
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
     * Internal function to check if the player has the specified permission(s)
     * @static
     * @param {string} id The faction id of a player
     * @param {string} playerID The character id of a player
     * @param {FACTION_PERMISSION_FLAGS} flag
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static hasPermission(id: string, characterID: string, flags: FACTION_PERMISSION_FLAGS): IResponse {
        const member = FactionInternalSystem.getMember(id, characterID);
        const rank = FactionInternalSystem.getRankFromMember(id, member);

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
     * Internal callable function to add a member to the faction.
     * @static
     * @param {string} id
     * @param {alt.Player} target
     * @return {*}  {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async addMember(id: string, target: alt.Player): Promise<IResponse> {
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
        await this.save(id, { players: factions[id].players });
        return { status: true, response: 'Target player was added to the faction.' };
    }

    /**
     * Internal callable function to remove a member from this faction based on their character id.
     * @static
     * @param {string} id
     * @param {string} characterID
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async removeMember(id: string, characterID: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        const memberIndex = factions[id].players.findIndex((member) => member.id === characterID);
        if (memberIndex <= -1) {
            return { status: false, response: 'Target player is not in your faction.' };
        }

        factions[id].players.splice(memberIndex, 1);
        await this.save(id, { players: factions[id].players });
        return { status: true, response: 'Target player was removed from your faction.' };
    }

    /**
     * Internal callable function to change a members's rank.
     * @static
     * @param {string} id The ID of the faction.
     * @param {string} characterID The member id.
     * @param {rankIndex} rankIndex The index of the rank we are changing it to.
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async setMemberRank(id: string, characterID: string, rankIndex: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: 'The faction rank no longer exists.' };
        }

        const memberIndex = factions[id].players.findIndex((member) => member.id === characterID);
        if (memberIndex <= -1) {
            return { status: false, response: 'Target player is not in your faction.' };
        }

        factions[id].players[memberIndex].rank = rankIndex;
        await this.save(id, { players: factions[id].players });
        return { status: true, response: `Target player's rank was set to ${rankIndex}` };
    }

    /**
     * Internal callable function to add a rank to a faction.
     * @static
     * @param {string} id FactionID
     * @param {string} rankName Name of New Rank
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async addRank(id: string, rankName: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        factions[id].ranks.push({ name: rankName, permissions: 0 });
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${rankName} was created.` };
    }

    /**
     * Internal callable function to remove a rank based on index from a faction.
     * @static
     * @param {string} id FactionID
     * @param {number} rankIndex Index in Rank Array
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async removeRank(id: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (factions[id].ranks.length <= 2) {
            return { status: false, response: `You cannot remove any more ranks. Must always have 2.` };
        }

        // Get all the players who are in the last rank.
        // Decrease their rank by 1. Making them higher up.
        for (let i = 0; i < factions[id].players.length; i++) {
            if (factions[id].players[i].rank !== factions[id].ranks.length - 1) {
                continue;
            }

            factions[id].players[i].rank -= 1;
        }

        factions[id].ranks.pop();
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank Index ${factions[id].ranks.length + 1} was removed.` };
    }

    /**
     * Internal callable function to change the name of a rank.
     * @static
     * @param {string} id
     * @param {number} rankIndex
     * @param {string} name
     * @return {*}
     * @memberof FactionSystem
     */
    static async setRankName(id: string, rankIndex: number, name: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: `The rank index of ${rankIndex} does not exist.` };
        }

        const oldName = factions[id].ranks[rankIndex].name;
        factions[id].ranks[rankIndex].name = name;
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${rankIndex} was changed from ${oldName} to ${name}` };
    }

    /**
     * Change rank permissions.
     * @static
     * @param {string} id
     * @param {number} rankIndex
     * @param {number} flags
     * @return {*}
     * @memberof FactionSystem
     */
    static async setRankPermissions(id: string, rankIndex: number, flags: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: `The rank index of ${rankIndex} does not exist.` };
        }

        const oldFlags = factions[id].ranks[rankIndex].permissions;
        factions[id].ranks[rankIndex].permissions = flags;
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${rankIndex} had permissions changed from ${oldFlags} to ${flags}` };
    }

    /**
     * Internal callable function to set the name of a faction and save it to the database.
     * @static
     * @param {string} id FactionID
     * @param {string} name Name of Faction
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async setName(id: string, name: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        factions[id].name = name;
        await this.save(id, { name: factions[id].name });
        return { status: true, response: `Faction name was set to ${name}` };
    }

    /**
     * Internal function to change rank order(s).
     * Members will follow the direction of the rank move.
     * @static
     * @param {string} id
     * @param {number} rankIndex
     * @return {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async changeRankOrder(id: string, rankIndex: number, moveDown: boolean = false): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: 'That rank does not exist.' };
        }

        const name = factions[id].ranks[rankIndex].name;
        const aboveRankIndex = moveDown ? rankIndex + 1 : rankIndex - 1;

        for (let i = 0; i < factions[id].players.length; i++) {
            if (factions[id].players[i].rank !== aboveRankIndex) {
                factions[id].players[i].rank += moveDown ? -1 : 1;
            }

            if (factions[id].players[i].rank === rankIndex) {
                factions[id].players[i].rank += moveDown ? 1 : -1;
            }
        }

        const rankBeingMoved = factions[id].ranks.splice(rankIndex, 1)[0];
        factions[id].ranks.splice(aboveRankIndex, 0, rankBeingMoved);
        await this.save(id, { ranks: factions[id].ranks, players: factions[id].players });

        const verb = moveDown ? 'moved down' : 'moved up';
        return { status: true, response: `Faction Rank Order Changed. ${name} was ${verb}.` };
    }

    /**
     * Internal function to open a storage container for a player.
     * @static
     * @param {string} id FactionID
     * @param {string} storageName Name of Faction
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async openStorage(player: alt.Player, id: string, storageName: FACTION_STORAGE): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!Object.values(FACTION_STORAGE).includes(storageName)) {
            return { status: false, response: 'The storage specified does not exist.' };
        }

        let storageID: string;

        // Storage type corresponds with storageName specified.
        if (!factions[id][storageName]) {
            const storage = await StorageSystem.create({ cash: 0, items: [], maxSize: 128 });
            factions[id][storageName] = storage._id.toString();
            await this.save(id, { storage: storage._id.toString(), players: factions[id].players });
            storageID = factions[id][storageName];
        } else {
            storageID = factions[id][storageName].toString();
        }

        StorageView.open(player, storageID, `Faction - ${storageName.toUpperCase()}`);
        return { status: true, response: 'Storage was opened.' };
    }

    /**
     * Deposits money to a faction bank.
     * @static
     * @param {string} id
     * @param {number} amount
     * @return {*}  {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async depositToBank(id: string, amount: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (typeof amount === 'string') {
            amount = Math.floor(parseInt(amount));
        } else {
            amount = Math.floor(amount);
        }

        if (isNaN(amount)) {
            return { status: false, response: `${amount} is not a valid number.` };
        }

        if (!factions[id].bank) {
            factions[id].bank = 0;
        }

        factions[id].bank += Math.abs(amount);
        await this.save(id, { bank: factions[id].bank });
        return { status: true, response: `Deposited $${amount}` };
    }

    /**
     * Deposits money to a faction bank.
     * @static
     * @param {string} id
     * @param {number} amount
     * @return {*}  {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async withdrawFromBank(id: string, amount: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (typeof amount === 'string') {
            amount = Math.floor(parseInt(amount));
        } else {
            amount = Math.floor(amount);
        }

        if (isNaN(amount)) {
            return { status: false, response: `${amount} is not a valid number.` };
        }

        if (!factions[id].bank) {
            factions[id].bank = 0;
        }

        factions[id].bank -= Math.abs(amount);
        await this.save(id, { bank: factions[id].bank });
        return { status: true, response: `Withdrew $${amount}` };
    }
}

FactionInternalSystem.init();
