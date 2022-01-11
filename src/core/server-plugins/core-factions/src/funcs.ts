import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import { Collections } from '../../../server/interface/iDatabaseCollections';
import { Faction, FactionCharacter, FactionRank } from '../../../shared-plugins/core-factions/interfaces';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { Character } from '../../../shared/interfaces/character';
import { FactionSystem, FACTION_COLLECTION } from './system';

export class FactionFuncs {
    /**
     * Get a faction character's rank based on character identifier
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterId
     * @return {(FactionRank | null)}
     * @memberof FactionFuncs
     */
    static getFactionMemberRank(faction: Faction, characterId: string): FactionRank | null {
        const member = faction.members[characterId];
        if (!member) {
            return null;
        }

        return faction.ranks.find((r) => r.uid === member.rank);
    }

    /**
     * Returns the lowest rank for the faction based on weight
     *
     * @static
     * @param {Faction} faction
     * @return {*}
     * @memberof FactionFuncs
     */
    static getRankWithLowestWeight(faction: Faction): FactionRank {
        let lowestRank = faction.ranks[0];

        for (let i = 0; i < faction.ranks.length; i++) {
            if (faction.ranks[i].weight >= lowestRank.weight) {
                continue;
            }

            lowestRank = faction.ranks[i];
        }

        return lowestRank;
    }

    /**
     * Check if a rank is above another rank
     *
     * @static
     * @param {Faction} faction
     * @param {string} _rank
     * @param {string} _vsRank
     * @return {*}
     * @memberof FactionFuncs
     */
    static isRankAbove(faction: Faction, _rank: string, _vsRank: string): boolean {
        const rank = faction.ranks.find((r) => r.uid === _rank);
        const vsRank = faction.ranks.find((r) => r.uid === _vsRank);
        return rank.weight > vsRank.weight ? true : false;
    }

    /**
     * Check if a rank is below another rank
     *
     * @static
     * @param {Faction} faction
     * @param {string} _rank
     * @param {string} _vsRank
     * @return {*}
     * @memberof FactionFuncs
     */
    static isRankBelow(faction: Faction, _rank: string, _vsRank: string): boolean {
        const rank = faction.ranks.find((r) => r.uid === _rank);
        const vsRank = faction.ranks.find((r) => r.uid === _vsRank);
        return rank.weight < vsRank.weight ? true : false;
    }

    /**
     * Add to faction bank.
     *
     * @static
     * @param {Faction} faction
     * @param {number} amount
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async addBank(faction: Faction, amount: number): Promise<boolean> {
        amount = Math.abs(amount);

        faction.bank += amount;
        const didUpdate = await FactionSystem.update(faction._id as string, { bank: faction.bank });
        return didUpdate.status;
    }

    /**
     * Remove from faction bank, returns false if amount is too high.
     *
     * @static
     * @param {Faction} faction
     * @param {number} amount
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async subBank(faction: Faction, amount: number): Promise<boolean> {
        amount = Math.abs(amount);

        if (faction.bank - amount < 0) {
            return false;
        }

        faction.bank -= amount;
        const didUpdate = await FactionSystem.update(faction._id as string, { bank: faction.bank });
        return didUpdate.status;
    }

    /**
     * Arbitrary way to set a rank for a character regardless of their standing.
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterID
     * @param {string} newRank
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async setRank(faction: Faction, characterID: string, newRank: string): Promise<boolean> {
        faction.members[characterID].rank = newRank;
        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
        return didUpdate.status;
    }

    /**
     * Arbitrary way to add a character to a faction based on character identifier.
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterID
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async addMember(faction: Faction, characterID: string): Promise<boolean> {
        const lowestRank = FactionFuncs.getRankWithLowestWeight(faction);
        const character = await Database.fetchData<Character>('_id', characterID, Collections.Characters);
        if (!character) {
            return false;
        }

        faction.members[characterID] = {
            id: characterID,
            name: character.name,
            rank: lowestRank.uid,
            hasOwnership: false,
        };

        await Database.updatePartialData(
            character._id.toString(),
            { faction: faction._id.toString() },
            FACTION_COLLECTION,
        );

        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
        return didUpdate.status;
    }

    /**
     * Arbitrary way to kick a character from a faction.
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterID
     * @return {*}  {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async kickMember(faction: Faction, characterID: string): Promise<boolean> {
        const character = await Database.fetchData<Character>(`_id`, characterID, Collections.Characters);
        if (character) {
            await Database.updatePartialData(character._id.toString(), { faction: null }, Collections.Factions);
        }

        delete faction.members[characterID];
        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
        return didUpdate.status;
    }
}

export class FactionPlayerFuncs {
    /**
     * Get the FactionRank of a player in a faction.
     *
     * @static
     * @param {alt.Player} player
     * @return {FactionRank}
     * @memberof FactionFuncs
     */
    static getPlayerFactionRank(player: alt.Player): FactionRank | null {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return null;
        }

        const member = faction.members[player.data._id.toString()];
        if (!member) {
            return null;
        }

        return faction.ranks.find((r) => r.uid === member.rank);
    }

    /**
     * Get FactionCharacter from faction player is in.
     *
     * @static
     * @param {alt.Player} player
     * @return {FactionCharacter}
     * @memberof FactionFuncs
     */
    static getPlayerInFaction(player: alt.Player): FactionCharacter {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return null;
        }

        return faction.members[player.data._id.toString()];
    }

    /**
     * Add a target player to a faction.
     * Ensures addMembers permission.
     * Target must not be in a faction.
     *
     * @static
     * @param {alt.Player} player
     * @param {alt.Player} target
     * @return {boolean}
     * @memberof FactionFuncs
     */
    static async addMember(player: alt.Player, target: alt.Player): Promise<boolean> {
        if (!target || !target.valid || !target.data || target.data.faction) {
            return false;
        }

        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id.toString());
        if (!selfRank.rankPermissions.addMembers) {
            return false;
        }

        const didUpdate = await FactionFuncs.addMember(faction, target.data._id.toString());
        if (!didUpdate) {
            return false;
        }

        target.data.faction = faction._id as string;
        return true;
    }

    /**
     * Kick a target character from a faction.
     * Ensures kick member permission.
     * Cannot kick member higher than player rank.
     *
     * @static
     * @param {alt.Player} player
     * @param {alt.Player} target
     * @return {boolean}
     * @memberof FactionFuncs
     */
    static async kickMember(player: alt.Player, characterId: string): Promise<boolean> {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!faction.members[characterId]) {
            return false;
        }

        // Get the current acting member's rank.
        const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
        if (!selfRank.rankPermissions.kickMembers) {
            return false;
        }

        // Check they are below current rank.
        const memberRank = FactionFuncs.getFactionMemberRank(faction, characterId);
        if (!FactionFuncs.isRankBelow(faction, selfRank.uid, memberRank.uid)) {
            return false;
        }

        const target = alt.Player.all.find((p) => p && p.valid && p.data._id.toString() === characterId);
        if (target) {
            target.data.faction = null;
        }

        return await FactionFuncs.kickMember(faction, characterId);
    }

    /**
     * Allows the user to set the rank of users below them.
     * Ensures set rank permission.
     * Rank cannot be higher or equal to the player's rank
     *
     * @static
     * @param {alt.Player} player
     * @param {string} characterId
     * @param {string} newRank
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async setRank(player: alt.Player, characterId: string, newRank: string): Promise<boolean> {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!faction.members[characterId]) {
            return false;
        }

        // Get the current acting member's rank.
        const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
        if (!selfRank.rankPermissions.manageMembers) {
            return false;
        }

        // Get the player being updated's rank.
        const rank = FactionFuncs.getFactionMemberRank(faction, characterId);
        if (!self || !rank) {
            return false;
        }

        // Ensure the rank update does not exceed current rank of self
        const isCurrentRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rank.uid);
        const isNextRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, newRank);
        if (isCurrentRankAbove || isNextRankAbove) {
            return false;
        }

        return await FactionFuncs.setRank(faction, characterId, newRank);
    }

    /**
     * Add currency to the faction bank.
     * Ensures bank add permission.
     *
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @return {*}
     * @memberof FactionFuncs
     */
    static async addBank(player: alt.Player, amount: number) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        // Get the current acting member's rank.
        const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
        if (!selfRank.rankPermissions.bankAdd) {
            return false;
        }

        amount = Math.abs(amount);
        if (!playerFuncs.currency.subAllCurrencies(player, amount)) {
            return false;
        }

        return await FactionFuncs.addBank(faction, amount);
    }

    /**
     * Remove money from a faction to a player.
     * Ensures bank removal permission.
     *
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async subBank(player: alt.Player, amount: number) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        // Get the current acting member's rank.
        const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
        if (!selfRank.rankPermissions.bankRemove) {
            return false;
        }

        amount = Math.abs(amount);
        const didRemove = FactionFuncs.subBank(faction, amount);
        if (!didRemove) {
            return false;
        }

        if (!playerFuncs.currency.add(player, CurrencyTypes.CASH, amount)) {
            return false;
        }

        return true;
    }
}
