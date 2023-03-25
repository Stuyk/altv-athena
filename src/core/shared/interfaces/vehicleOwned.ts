import { BaseVehicle } from './vehicleBase';
import { VehicleState } from './vehicleState';
import VehicleTuning from './vehicleTuning';

/**
 * Used to describe vehicle part damage.
 */
export type PartDamage = { bulletHoles?: number; damageLevel: string };

/**
 * Used to describe vehicle damage to apply to a vehicle.
 *
 * @export
 * @interface VehicleDamage
 */
export interface VehicleDamage {
    /**
     * What parts are damaged.
     *
     * @type {{ [part: string]: PartDamage }}
     * @memberof VehicleDamage
     */
    parts?: { [part: string]: PartDamage };

    /**
     * What bumpers are damaged.
     *
     * @type {{ [part: string]: PartDamage }}
     * @memberof VehicleDamage
     */
    bumpers?: { [part: string]: PartDamage };

    /**
     * What windows are damaged.
     *
     * @type {{ [part: string]: PartDamage }}
     * @memberof VehicleDamage
     */
    windows?: { [part: string]: PartDamage };

    /**
     * What wheels are damaged.
     *
     * @type {Array<PartDamage>}
     * @memberof VehicleDamage
     */
    wheels?: Array<PartDamage>;

    /**
     * What lights are damaged.
     *
     * @type {Array<PartDamage>}
     * @memberof VehicleDamage
     */
    lights?: Array<PartDamage>;
}

/**
 * Used to describe an owned vehicle.
 *
 * @export
 * @interface OwnedVehicle
 * @extends {BaseVehicle}
 */
export interface OwnedVehicle extends BaseVehicle {
    /**
     * Vehicle Tuning Interface
     * @type {VehicleTuning}
     * @memberof IVehicle
     */
    tuning?: Partial<VehicleTuning> | VehicleTuning | undefined;

    /**
     * Data that matches the alt.Vehicle API setters
     *
     * @type {Partial<VehicleState> | VehicleState}
     * @memberof OwnedVehicle
     */
    state?: Partial<VehicleState> | VehicleState;

    /**
     * Damage to store / apply on a vehicle
     *
     * @type {VehicleDamage}
     * @memberof OwnedVehicle
     */
    damage?: VehicleDamage;
}
