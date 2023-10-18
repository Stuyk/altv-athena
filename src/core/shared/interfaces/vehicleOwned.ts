import { BaseVehicle } from './vehicleBase.js';
import VehicleExtra from './vehicleExtra.js';
import { VehicleState } from './vehicleState.js';
import VehicleTuning from './vehicleTuning.js';

/**
 * Used to describe vehicle part damage.
 */
export type PartDamage = { bulletHoles?: number; damageLevel: string };

/**
 * Used to describe vehicle damage to apply to a vehicle.
 *
 *
 * @interface VehicleDamage
 */
export interface VehicleDamage {
    /**
     * What parts are damaged.
     *
     * @type {{ [part: string]: PartDamage }}
     *
     */
    parts?: { [part: string]: PartDamage };

    /**
     * What bumpers are damaged.
     *
     * @type {{ [part: string]: PartDamage }}
     *
     */
    bumpers?: { [part: string]: PartDamage };

    /**
     * What windows are damaged.
     *
     * @type {{ [part: string]: PartDamage }}
     *
     */
    windows?: { [part: string]: PartDamage };

    /**
     * What wheels are damaged.
     *
     * @type {Array<PartDamage>}
     *
     */
    wheels?: Array<PartDamage>;

    /**
     * What lights are damaged.
     *
     * @type {Array<PartDamage>}
     *
     */
    lights?: Array<PartDamage>;
}

/**
 * Used to describe an owned vehicle.
 *
 *
 * @interface OwnedVehicle
 * @extends {BaseVehicle}
 */
export interface OwnedVehicle extends BaseVehicle {
    /**
     * Vehicle Tuning Interface
     * @type {VehicleTuning}
     *
     */
    tuning?: Partial<VehicleTuning> | VehicleTuning | undefined;

    /**
     * Data that matches the alt.Vehicle API setters
     *
     * @type {Partial<VehicleState> | VehicleState}
     *
     */
    state?: Partial<VehicleState> | VehicleState;

    /**
     * Damage to store / apply on a vehicle
     *
     * @type {VehicleDamage}
     *
     */
    damage?: VehicleDamage;

    /**
     * Damage to store / apply on a vehicle
     *
     * @type {VehicleDamage}
     *
     */
    extras?: Array<VehicleExtra>;
}
