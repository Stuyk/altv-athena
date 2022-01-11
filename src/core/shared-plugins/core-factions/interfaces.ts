type _id = string;

/**
 * Permissions that belong to an individual rank.
 * @export
 * @interface RankPermissions
 */
export interface RankPermissions {
    /**
     * Can this rank add to the bank?
     *
     * @type {boolean}
     * @memberof FactionRank
     */
    bankAdd: boolean;

    /**
     * Can this rank remove from the bank?
     *
     * @type {boolean}
     * @memberof FactionRank
     */
    bankRemove: boolean;

    /**
     * Can this rank manage ranks lower than itself?
     *
     * @type {boolean}
     * @memberof FactionRank
     */
    manageRanks: boolean;

    /**
     * Can this rank manage rank permissions lower than itself?
     *
     * @type {boolean}
     * @memberof RankPermissions
     */
    manageRankPermissions: boolean;

    /**
     * Can this rank manage members by promoting and demoting lower than itself?
     *
     * @type {boolean}
     * @memberof FactionRank
     */
    manageMembers: boolean;

    /**
     * Can this rank kick members lower than itself?
     *
     * @type {boolean}
     * @memberof FactionRank
     */
    kickMembers: boolean;

    /**
     * Can this rank add members lower than itself?
     *
     * @type {boolean}
     * @memberof RankPermissions
     */
    addMembers: boolean;
}

/**
 * Character reference for a faction.
 *
 * @export
 * @interface FactionCharacter
 */
export interface FactionCharacter {
    /**
     * The character ID of the Character.
     *
     * @type {string}
     * @memberof FactionCharacter
     */
    id: _id;

    /**
     * Name of the Character
     *
     * @type {string}
     * @memberof FactionCharacter
     */
    name: string;

    /**
     * A unique identifier for the rank.
     *
     * @type {string}
     * @memberof FactionCharacter
     */
    rank: string;

    /**
     * Does this member have Ownership of the Faction?
     *
     * @type {boolean}
     * @memberof FactionCharacter
     */
    hasOwnership: boolean;
}

/**
 * A rank inside of the Faction
 *
 * @export
 * @interface FactionRank
 */
export interface FactionRank {
    /**
     * A unique identifier for the Faction Rank
     * Should be auto-generated.
     *
     * @type {string}
     * @memberof FactionRank
     */
    uid?: string;

    /**
     * The name of this Rank
     *
     * @type {string}
     * @memberof FactonRank
     */
    name: string;

    /**
     * Custom action permissions this rank has access to.
     *
     * @type {Array<string>}
     * @memberof FactionRank
     */
    actionPermissions: Array<string>;

    /**
     * Permissions for the rank.
     *
     * @type {RankPermissions}
     * @memberof FactionRank
     */
    rankPermissions: RankPermissions;

    /**
     * An array of storages this rank can access.
     *
     * @type {Array<_id>}
     * @memberof FactionRank
     */
    storages: Array<_id>;

    /**
     * Vehicles this rank has keys to by default.
     *
     * @type {Array<_id>}
     * @memberof FactionRank
     */
    vehicles: Array<_id>;

    /**
     * The higher the weight the more important they are.
     * Owner rank is always 99.
     * Nothing can exceed 99.
     *
     * @type {number}
     * @memberof FactionRank
     */
    weight: number;
}

/**
 * Core Values for the Faction Interface
 *
 * @export
 * @interface FactionCore
 */
export interface FactionCore {
    /**
     * Database document reference identification
     * Do not change this value.
     *
     * @type {unknown}
     * @memberof Faction
     */
    _id?: unknown | string;

    /**
     * The name of this Faction
     * @type {string}
     * @memberof Faction
     */
    name: string;

    /**
     * Amount of money in the bank for this Faction.
     *
     * @type {number}
     * @memberof Faction
     */
    bank: number;

    /**
     * Can the Faction be disbanded by the owner at any time?
     *
     * @type {boolean}
     * @memberof Faction
     */
    canDisband: boolean;
}

/**
 * Main Faction Interface
 * Values not needed during faction creation
 *
 * @export
 * @interface Faction
 */
export interface Faction extends FactionCore {
    /**
     * Members who are currently in this faction.
     * Members can be fetched by their `player.data._id` entry.
     *
     * @type { [key: _id]: FactionCharacter }
     * @memberof Faction
     */
    members: { [key: _id]: FactionCharacter };

    /**
     * Ranks in this faction.
     *
     * @type {Array<FactionRank>}
     * @memberof Faction
     */
    ranks: Array<FactionRank>;

    /**
     * A way to obtain available faction based actions by Rank UID.
     * An action uid inside of this object is valid for that ranks usage.
     *
     * Example: { jklkfdsakljfewawa: ['arrest-action', 'claim-paycheck-action'] }
     *
     * @type {{ [key: string]: Array<FactionAction> }}
     * @memberof Faction
     */
    actions: { [key: string]: Array<string> };

    /**
     * Vehicles that are in control for this Faction.
     *
     * @type {Array<_id>}
     * @memberof Faction
     */
    vehicles: Array<_id>;

    /**
     * Storages that belong to this faction.
     *
     * @type {Array<string>}
     * @memberof Faction
     */
    storages?: Array<string>;
}
