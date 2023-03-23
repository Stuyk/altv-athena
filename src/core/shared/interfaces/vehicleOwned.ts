import { BaseVehicle } from './vehicleBase';
import { VehicleState } from './vehicleState';
import VehicleTuning from './vehicleTuning';

export type PartDamage = { bulletHoles?: number; damageLevel: string };

export interface VehicleDamage {
    parts?: { [part: string]: PartDamage };
    bumpers?: { [part: string]: PartDamage };
    windows?: { [part: string]: PartDamage };
    wheels?: Array<PartDamage>;
    lights?: Array<PartDamage>;
}

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
