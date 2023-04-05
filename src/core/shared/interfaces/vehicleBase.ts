import * as alt from 'alt-shared';

/**
 * Used as the main describer of a stored vehicle.
 *
 *
 * @interface BaseVehicle
 */
export interface BaseVehicle {
    /**
     * The vehicle identifier for the database.
     * Also used to save to the database.
     * @type {*}
     *
     */
    _id?: unknown;

    /**
     * The vehicle id for lookups.
     * @type {number}
     *
     */
    id?: number;

    /**
     * The player who is the owner of this vehicle.
     * Corresponds with character._id or null if it belongs to anything else
     * Obviously permissions and keys should be used if no owner is set.
     *
     * @type {string}
     *
     */
    owner: string | null;

    /**
     * The model of this vehicle.
     * @type {string}
     *
     */
    model: string;

    /**
     * The last position where this vehicle was last left.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The last rotation where this vehicle was last left.
     * @type {alt.IVector3}
     *
     */
    rot: alt.IVector3;

    /**
     * Used to control what dimension this vehicle should spawn in / be found in
     * @type {string}
     *
     */
    dimension: number;

    /**
     * A unique identifier for this specific vehicle.
     * Usually automatically generated.
     * @type {string}
     *
     */
    plate: string;

    /**
     * A list of character ids that have access to this vehicle
     *
     * @type {Array<string>}
     *
     */
    keys: Array<string>;

    /**
     * A list of character permissions that have access to this vehicle
     *
     * @type {Array<string>}
     *
     */
    permissions: Array<string>;

    /**
     * The fuel level for this vehicle.
     *
     * @type {number}
     *
     */
    fuel: number;

    /**
     * Set this value to an indexable garage.
     * If this value is set it means it will not be spawned when a player joins.
     *
     * @type {number}
     *
     */
    garageInfo?: number;

    /**
     * Flag this value to prevent this vehicle from ever being despawned
     *
     * @type {boolean}
     *
     */
    doNotDespawn?: boolean;

    /**
     * The last known timestamp when this vehicle was used.
     *
     * @type {number}
     *
     */
    lastUsed?: number;

    /**
     * A key value pair of a group, and what permissions they have in that group.
     *
     * @type {{ [key: string]: Array<string> }}
     * @memberof BaseVehicle
     */
    groups?: { [key: string]: Array<string> };
}
