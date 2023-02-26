import { Vehicle_Behavior } from '../enums/vehicle';
import VehicleTuning from './vehicleTuning';
import { BaseVehicle } from './vehicleBase';
import { VehicleState } from './vehicleState';

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
    tuning?: Partial<VehicleTuning> | VehicleTuning | undefined;

    /**
     * Data that matches the alt.Vehicle API setters
     *
     * @type {Partial<VehicleState> | VehicleState}
     * @memberof OwnedVehicle
     */
    state?: Partial<VehicleState> | VehicleState;
}
