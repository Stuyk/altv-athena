import { FACTION_PERMISSION_FLAGS } from '../flags/factionPermissionFlags';
import { Vector3 } from './vector';

export interface FactionMember {
    /**
     * The database id associated with this faction member (character).
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
     * The name of this faction rank.
     * @type {string}
     * @memberof FactionRank
     */
    name: string;

    /**
     * Permissions associated with this faction rank.
     * @type {FACTION_PERMISSION_FLAGS}
     * @memberof FactionRank
     */
    permissions: FACTION_PERMISSION_FLAGS;
}

export interface IFaction {
    /**
     * The database identifier for this faction.
     * @type {unknown}
     * @memberof IFaction
     */
    _id?: unknown;

    /**
     * The name of this faction.
     * @type {string}
     * @memberof IFaction
     */
    name: string;

    /**
     * The faction central location for basing other points.
     * Should be an outside position.
     * @type {Vector3}
     * @memberof IFaction
     */
    pos: Vector3;

    /**
     * The ranks in this faction.
     * The highest rank always has an index of 0.
     * @type {Array<FactionRank>}
     * @memberof IFaction
     */
    ranks?: Array<FactionRank>;

    /**
     * Dimension for this faction if necessary.
     * Used for interiors.
     * @type {number}
     * @memberof IFaction
     */
    dimension?: number;

    /**
     * The faction member(s) in this faction.
     * @type {Array<FactionMember>}
     * @memberof IFaction
     */
    players?: Array<FactionMember>;

    /**
     * The location to access the vehicle storage for the faction.
     * @type {Vector3}
     * @memberof IFaction
     */
    storageLocation?: Vector3;

    /**
     * Storage ID for the storage collection.
     * @type {string}
     * @memberof IFaction
     */
    storage?: string;

    /**
     * The location to access the weapon storage for the faction.
     * @type {Vector3}
     * @memberof IFaction
     */
    weaponLocation?: Vector3;

    /**
     * Storage ID for the storage collection.
     * @type {string}
     * @memberof IFaction
     */
    weaponStorage?: string;

    /**
     * Faction Bank. Self explanatory.
     * @type {number}
     * @memberof IFaction
     */
    bank?: number;

    /**
     * A list of logs about who changed what, and when.
     * @type {Array<string>}
     * @memberof IFaction
     */
    logs: Array<string>;
}
