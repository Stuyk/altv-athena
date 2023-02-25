import * as alt from 'alt-shared';

export interface BaseVehicle {
    /**
     * The vehicle identifier for the database.
     * Also used to save to the database.
     * @type {*}
     * @memberof IVehicle
     */
    _id?: unknown;

    /**
     * The vehicle id for lookups.
     * @type {number}
     * @memberof IVehicle
     */
    id?: number;

    /**
     * The player who is the owner of this vehicle.
     * Corresponds with character._id or null if it belongs to anything else
     * Obviously permissions and keys should be used if no owner is set.
     *
     * @type {string}
     * @memberof IVehicle
     */
    owner: string | null;

    /**
     * The model of this vehicle.
     * @type {string}
     * @memberof IVehicle
     */
    model: string;

    /**
     * The last position where this vehicle was last left.
     * @type {alt.IVector3}
     * @memberof IVehicle
     */
    pos: alt.IVector3;

    /**
     * The last rotation where this vehicle was last left.
     * @type {alt.IVector3}
     * @memberof IVehicle
     */
    rot: alt.IVector3;

    /**
     * Used to control what dimension this vehicle should spawn in / be found in
     * @type {string}
     * @memberof IVehicle
     */
    dimension: number;

    /**
     * A unique identifier for this specific vehicle.
     * Usually automatically generated.
     * @type {string}
     * @memberof IVehicle
     */
    plate: string;

    /**
     * A list of character ids that have access to this vehicle
     *
     * @type {Array<string>}
     * @memberof BaseVehicle
     */
    keys: Array<string>;

    /**
     * A list of character permissions that have access to this vehicle
     *
     * @type {Array<string>}
     * @memberof BaseVehicle
     */
    permissions: Array<string>;
}
