import { Vehicle_Behavior } from '../enums/vehicle';
import { VEHICLE_OWNERSHIP } from '../flags/VehicleOwnershipFlags';
import { IStorage } from './IStorage';
import { Vector3 } from './Vector';

export interface IVehicle {
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
     * Behavior of this vehicle.
     * Determines what players can do with this vehicle.
     * @type {Vehicle_Behavior}
     * @memberof IVehicle
     */
    behavior?: Vehicle_Behavior;

    /**
     * Last interior this vehicle was in.
     * @type {string}
     * @memberof IVehicle
     */
    interior?: string;

    /**
     * A unique identifier for this specific vehicle.
     * Usually automatically generated.
     * @type {string}
     * @memberof IVehicle
     */
    plate?: string;

    /**
     * The owner of this vehicle.
     * Owner can either be a character id or a faction id.
     * @type {string}
     * @memberof IVehicle
     */
    owner: string;

    /**
     * The ownership type for this vehicle.
     * @type {VEHICLE_OWNERSHIP}
     * @memberof IVehicle
     */
    ownerType?: VEHICLE_OWNERSHIP;

    /**
     * The model of this vehicle.
     * @type {string}
     * @memberof IVehicle
     */
    model: string;

    /**
     * The last position where this vehicle was last left.
     * @type {Vector3}
     * @memberof IVehicle
     */
    position: Vector3;

    /**
     * The last rotation where this vehicle was last left.
     * @type {Vector3}
     * @memberof IVehicle
     */
    rotation: Vector3;

    /**
     * What garage does this vehicle belong to?
     * @type {number}
     * @memberof IVehicle
     */
    garageIndex?: number;

    /**
     * The amount of fuel left in this vehicle.
     * @type {number}
     * @memberof IVehicle
     */
    fuel?: number;

    /**
     * The outside health of the vehicle.
     * @type {number}
     * @memberof IVehicle
     */
    bodyHealth?: number;

    /**
     * The engine health of the vehicle.
     * @type {number}
     * @memberof IVehicle
     */
    engineHealth?: number;

    /**
     * The last time this vehicle was used.
     * @type {number}
     * @memberof IVehicle
     */
    lastUsed?: number;

    /**
     * The trunk of the vehicle can hand these items.
     * @type {IStorage}
     * @memberof IVehicle
     */
    storage?: IStorage;

    /**
     * Simply what colour is this vehicle?
     * Alpha should always be 255.
     * No other value matters.
     * @type {{
     *         r: number;
     *         g: number;
     *         b: number;
     *         a: number;
     *     }}
     * @memberof IVehicle
     */
    color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    // mods...
}
