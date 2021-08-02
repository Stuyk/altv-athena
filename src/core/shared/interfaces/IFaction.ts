export interface FactionMember {
    /**
     * The database id associated with this faction member.
     * @type {string}
     * @memberof FactionMember
     */
    id: string;

    /**
     * The name of this faction member.
     * @type {string}
     * @memberof FactionMember
     */
    name: string;

    /**
     * The current rank of this faction member.
     * @type {number}
     * @memberof FactionMember
     */
    rank: number;
}

export interface FactionRank {
    /**
     * Permissions associated with this faction rank.
     * @type {number}
     * @memberof FactionRank
     */
    permissions: number; // Placeholder
}

export interface IFaction {
    /**
     * The database identifier for this faction.
     * @type {unknown}
     * @memberof IFaction
     */
    _id?: unknown;

    /**
     * The id for this faction.
     * @type {number}
     * @memberof IFaction
     */
    id: number;

    /**
     * The faction member(s) in this faction.
     * @type {Array<FactionMember>}
     * @memberof IFaction
     */
    players: Array<FactionMember>;
}
