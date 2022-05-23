import { Vehicle_Behavior } from '../enums/vehicle';
import { VEHICLE_OWNERSHIP } from '../flags/vehicleOwnershipFlags';
import IVehicleTuning from './iVehicleTuning';
import { RGB } from './rgb';
import { Vector3 } from './vector';

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
     * A unique SHA256 key for players to mint keys for this vehicle;
     * @type {string}
     * @memberof Vehicle
     */
    key?: string;

    /**
     * Behavior of this vehicle.
     * Determines what players can do with this vehicle.
     * @type {Vehicle_Behavior}
     * @memberof IVehicle
     */
    behavior?: Vehicle_Behavior;

    /**
     * Used for players to easily know what vehicle they're pulling out.
     * @type {string}
     * @memberof IVehicle
     */
    nickname?: string;

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
     * Owner can either be a character id, faction, whatever.
     *
     * @type {string}
     * @memberof IVehicle
     */
    owner: string;

    /**
     * The ownership type for this vehicle.
     * null means it is player owned
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
    garageIndex?: number | string;

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
     * The IStorage collection id reference in the database.
     * @type {string}
     * @memberof IVehicle
     */
    storage?: string;

    /**
     * The paint 'finish' on the vehicle. Only applies for custom colors.
     *
     * @type {number}
     * @memberof IVehicle
     */
    finish1?: number;

    /**
     * The paint 'finish' on the vehicle. Only applies for custom colors.
     *
     * @type {number}
     * @memberof IVehicle
     */
    finish2?: number;

    /**
     * Pearl Color, -1 does not apply
     *
     * @type {number}
     * @memberof IVehicle
     */
    pearl?: number;

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
    color?: RGB | number;

    /**
     * Secondary color of the vehicle.
     * @type {RGB}
     * @memberof IVehicle
     */
    color2?: RGB | number;

    /**
     * Vehicle Tuning Interface
     * @type {IVehicleTuning}
     * @memberof IVehicle
     */
    tuning?: IVehicleTuning | null;
}
