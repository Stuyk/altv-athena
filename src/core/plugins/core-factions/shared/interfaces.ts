import { Vector3 } from '../../../shared/interfaces/vector';

type _id = string;

export const RankPermissionNames = {
    bankAdd: 'bankAdd',
    bankRemove: 'bankRemove',
    manageRanks: 'manageRanks',
    manageRankPermissions: 'manageRankPermissions',
    manageMembers: 'manageMembers',
    kickMembers: 'kickMembers',
    addMembers: 'addMembers',
};

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
     * Can this rank remove from the bank,
     * purchase vehicles,
     * and do general faction bank purchases.
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

    /**
     * Can manage vehicles by purchasing vehicles available.
     *
     * @type {boolean}
     * @memberof RankPermissions
     */
    manageVehicles?: boolean;
}

/**
 * Character reference for a faction.
 *
 * @export
 * @interface FactionCharacter
 */
export interface FactionCharacter {
    [key: string]: any;

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
    [key: string]: any;

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


    /**
     * Faction Type (gang, neutral, state)
     *
     * @type {string}
     * @memberof Faction
     */
    type: string;
}

export interface FactionStorage {
    /**
     * The name of this storage facility.
     *
     * @type {string}
     * @memberof FactionStorage
     */
    name: string;

    /**
     * Position of the storage facility
     *
     * @type {Vector3}
     * @memberof FactionStorage
     */
    pos: Vector3;

    /**
     * Database _id for the storage
     *
     * @type {string}
     * @memberof FactionStorage
     */
    id: string;

    /**
     * Allow what ranks to use this storage facility?
     *
     * @type {Array<string>}
     * @memberof FactionStorage
     */
    allowRanks: Array<string>;
}

export interface FactionVehicle {
    /**
     * The name given to this vehicle for easier tracking
     *
     * @type {string}
     * @memberof FactionVehicle
     */
    model: string;

    /**
     * Database _id for the vehicle
     *
     * @type {string}
     * @memberof FactionVehicle
     */
    id: string;
}

export interface FactionSettings {
    [key: string]: any;

    /**
     * The current positions of faction headquarters.
     *
     * @type {Vector3}
     * @memberof FactionSettings
     */
    position?: Vector3;

    /**
     * A list of vehicle parking spots to spawn vehicles from.
     *
     * @type {Array<Vector3>}
     * @memberof Faction
     */
    parkingSpots?: Array<{ pos: Vector3; rot: Vector3 }>;

    /**
     * A list of vehicles available for purchase for this faction.
     *
     * @type {Array<{ model: string, price: number }>}
     * @memberof FactionSettings
     */
    vehicles?: Array<{ model: string; price: number }>;

    /**
     * Maximum number of vehicles purchaseable by the Faction
     *
     * @type {number}
     * @memberof FactionSettings
     */
    maxVehicles?: number;

    /**
     * A blip sprite index.
     *
     * @type {number}
     * @memberof FactionSettings
     */
    blip?: number;

    /**
     * A blip sprite colour.
     *
     * @type {number}
     * @memberof FactionSettings
     */
    blipColor?: number;

    /**
     * Message of the day for factions.
     *
     * @type {string}
     * @memberof FactionSettings
     */
    motd?: string;
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
     * An array of available action uids for this faction. May not be defined.
     *
     * @type {Array<string>}
     * @memberof Faction
     */
    availableActions?: Array<string>;

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
     * A way to passively invoke faction based actions on a faction.
     * This is a unique way to update a specific faction's user base in-game.
     * Think of it like a 'tick' event for factions but it's slower.
     *
     * Can be used for things like paychecks, robbery reports, etc.
     *
     * @type {Array<string>}
     * @memberof Faction
     */
    tickActions: Array<string>;

    /**
     * Vehicles that are in control for this Faction.
     *
     * @type {Array<FactionVehicle>}
     * @memberof Faction
     */
    vehicles: Array<FactionVehicle>;

    /**
     * Storages that belong to this faction.
     *
     * @type {Array<FactionStorage>}
     * @memberof Faction
     */
    storages?: Array<FactionStorage>;

    /**
     * Expandable Faction Settings for Individual Settings
     *
     * @type {FactionSettings}
     * @memberof Faction
     */
    settings?: FactionSettings;
}
