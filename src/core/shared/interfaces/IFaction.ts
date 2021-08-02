import { FactionPermissionFlags } from '../flags/FactionPermissionFlags';
import { Vector3 } from './Vector';

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
     * Permissions associated with this faction rank.
     * @type {FactionPermissionFlags}
     * @memberof FactionRank
     */
    permissions: FactionPermissionFlags;
}

export interface IFaction {
    /**
     * The database identifier for this faction.
     * @type {unknown}
     * @memberof IFaction
     */
    _id?: unknown;

    /**
     * The faction central location for basing other points.
     * Should be an outside position.
     * @type {Vector3}
     * @memberof IFaction
     */
    pos: Vector3;

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
    players: Array<FactionMember>;

    /**
     * The location to access the vehicle storage for the faction.
     * @type {Vector3}
     * @memberof IFaction
     */
    storageLocation: Vector3;

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
    weaponLocation: Vector3;

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
    bank: number;

    /**
     * A list of logs about who changed what, and when.
     * @type {Array<string>}
     * @memberof IFaction
     */
    logs: Array<string>;
}
