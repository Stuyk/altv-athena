import { Faction, FactionCharacter, FactionRank, RankPermissions } from '../../shared/interfaces';

export class FactionParser {
    /**
     * Given a faction and a member _id or a unique identifier, return the rank of the member _id or null
     * if the member _id is not in the faction
     * @param {Faction} faction - The faction object to get the rank from.
     * @param {FactionCharacter | string} characterOrUID - A FactionCharacter object or a string
     * representing the UID of a FactionCharacter.
     * @returns The rank object.
     */
    static getRank(faction: Faction, characterOrUID: FactionCharacter | string): FactionRank | null {
        let uid;

        if (typeof characterOrUID === 'string') {
            uid = characterOrUID;
        } else {
            uid = characterOrUID.rank;
        }

        const index = faction.ranks.findIndex((rank) => rank.uid === uid);
        if (index <= -1) {
            return null;
        }

        return faction.ranks[index];
    }

    /**
     * Given a faction and a character or a unique ID, return the name of the rank
     * @param {Faction} faction - The faction object that the character is in.
     * @param {FactionCharacter | string} characterOrUID - A FactionCharacter or a string. If a string,
     * it's the UID of the rank.
     * @returns The name of the rank.
     */
    static getRankName(faction: Faction, characterOrUID: FactionCharacter | string): string {
        let uid;

        if (typeof characterOrUID === 'string') {
            uid = characterOrUID;
        } else {
            uid = characterOrUID.rank;
        }

        const index = faction.ranks.findIndex((rank) => rank.uid === uid);
        if (index <= -1) {
            return 'No Name';
        }

        return faction.ranks[index].name;
    }

    /**
     * Get a member of a faction by their unique identifier
     * @param {Faction} faction - The Faction object that the character is a member of.
     * @param {string} uid - The unique ID of the faction member.
     * @returns A FactionCharacter object or null.
     */
    static getMember(faction: Faction, uid: string): FactionCharacter | null {
        return faction.members[uid];
    }

    /**
     * Returns a list of faction members by rank.
     *
     * @static
     * @param {Faction} faction
     * @param {string} rankID
     * @return {*}
     * @memberof FactionParser
     */
    static getFactionMembersByRank(faction: Faction, rankID: string) {
        if (!faction || !faction.ranks || !rankID) {
            return [];
        }

        const members: Array<{ id?: string } & FactionCharacter> = [];
        Object.keys(faction.members).forEach((key) => {
            if (!faction.members[key]) {
                return;
            }

            if (faction.members[key].rank !== rankID) {
                return;
            }

            members.push({ ...faction.members[key], id: key });
        });

        return members;
    }

    /**
     * It returns an array of objects containing the members of the faction.
     * @param {Faction} faction - The faction object that we're getting the members of.
     * @returns An array of objects.
     */
    static getFactionMembers(
        faction: Faction,
        orderByRank = true,
    ): Array<{ id?: string; weight?: number } & FactionCharacter> {
        if (!faction || !faction.members) {
            return [];
        }

        const members: Array<{ id?: string; weight: number } & FactionCharacter> = [];
        Object.keys(faction.members).forEach((key) => {
            if (!faction.members[key]) {
                return;
            }

            const rank = FactionParser.getRank(faction, faction.members[key].rank);

            let weight = 0;
            if (rank && rank.weight) {
                weight = rank.weight;
            }

            members.push({ ...faction.members[key], id: key, weight: weight });
        });

        let sorted = members;
        if (orderByRank) {
            sorted = members.sort((a, b) => {
                return b.weight - a.weight;
            });
        }

        return sorted;
    }

    static getRankPermissions(faction: Faction, uid: string): Partial<RankPermissions> {
        if (!uid) {
            return {};
        }

        const rank = FactionParser.getRank(faction, uid);
        if (!rank) {
            return {};
        }

        return rank.rankPermissions;
    }

    /**
     * Check if a rank is higher.
     *
     * @static
     * @param {FactionRank} actingUserRank
     * @param {FactionRank} againstUserRank
     * @return {*}
     * @memberof FactionParser
     */
    static isRankHigher(actingUserRank: FactionRank, againstUserRank: FactionRank) {
        if (actingUserRank.uid === againstUserRank.uid) {
            return true;
        }

        if (actingUserRank.weight >= againstUserRank.weight) {
            return false;
        }

        return true;
    }

    /**
     * Compares two ranks and returns permissions if the rank is lower than their current rank.
     *
     * @static
     * @param {FactionRank} actingUserRank
     * @param {FactionRank} againstUserRank
     * @return {*}  {Partial<RankPermissions>}
     * @memberof FactionParser
     */
    static getValidPermissions(
        actingUserRank: FactionRank,
        againstUserRank: FactionRank,
        hasOwnership = false,
    ): Partial<RankPermissions> {
        if (actingUserRank.uid === againstUserRank.uid && !hasOwnership) {
            return {};
        }

        if (actingUserRank.weight < againstUserRank.weight) {
            return {};
        }

        return actingUserRank.rankPermissions;
    }

    /**
     * Get a list of current faction ranks sorted by rank.
     *
     * @static
     * @param {Faction} faction
     * @return {Array<FactionRank>}
     * @memberof FactionParser
     */
    static getFactionRanks(faction: Faction): Array<FactionRank> {
        if (!faction.ranks) {
            return [];
        }

        const ranks = faction.ranks.sort((a, b) => {
            return b.weight - a.weight;
        });

        return ranks;
    }
}
