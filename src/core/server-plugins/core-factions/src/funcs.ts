import * as alt from 'alt-server';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import { Faction, FactionCharacter, FactionRank } from '../../../shared-plugins/core-factions/interfaces';
import { FactionSystem } from './system';

export class FactionFuncs {
    /**
     * Get the FactionRank of a player in a faction.
     *
     * @static
     * @param {alt.Player} player
     * @return {FactionRank}
     * @memberof FactionFuncs
     */
    static getPlayerFactionRank(player: alt.Player): FactionRank {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return null;
        }

        const rank = faction.members[player.data._id.toString()];
        if (!rank) {
            return null;
        }

        return faction.ranks.find((r) => r.uid === rank.id);
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
     * Get member information in faction.
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
     * Add a target player to a faction
     *
     * @static
     * @param {alt.Player} player
     * @param {alt.Player} target
     * @return {boolean}
     * @memberof FactionFuncs
     */
    static async addMember(player: alt.Player, target: alt.Player): Promise<boolean> {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!target || !target.valid || !target.data || target.data.faction) {
            return false;
        }

        const rank = FactionFuncs.getPlayerFactionRank(player);
        if (!rank.rankPermissions.addMembers) {
            return false;
        }

        const lowestRank = FactionFuncs.getRankWithLowestWeight(faction);
        faction.members[target.data._id.toString()] = {
            id: target.data._id.toString(),
            name: target.data.name,
            rank: lowestRank.uid,
            hasOwnership: false,
        };

        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
        if (!didUpdate.status) {
            return false;
        }

        target.data.faction = faction._id as string;
        playerFuncs.save.field(target, 'faction', target.data.faction);
        return true;
    }

    /**
     * Kick a target character from a faction
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

        const target = alt.Player.all.find((p) => p && p.valid && p.data._id.toString() === characterId);
        if (target) {
            target.data.faction = null;
            playerFuncs.save.field(target, 'faction', target.data.faction);
        }

        delete faction.members[characterId];

        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
        if (!didUpdate.status) {
            return false;
        }

        return true;
    }
}
