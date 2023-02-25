import { Vehicle_Behavior } from '../enums/vehicle';
import { BaseVehicle } from './vehicleBase';
import VehicleDamage from './vehicleDamage';
import { VehicleState } from './vehicleState';
import VehicleTuning from './vehicleTuning';

export interface OwnedVehicle extends BaseVehicle {
    /**
     * Behavior of this vehicle.
     * Determines what players can do with this vehicle.
     * @type {Vehicle_Behavior}
     * @memberof IVehicle
     */
    behavior?: Vehicle_Behavior;

    /**
     * The amount of fuel left in this vehicle.
     * @type {number}
     * @memberof IVehicle
     */
    fuel?: number;

    /**
     * Vehicle Tuning Interface
     * @type {VehicleTuning}
     * @memberof IVehicle
     */
    tuning?: Partial<VehicleTuning> | undefined;

    state?: VehicleState;
}
