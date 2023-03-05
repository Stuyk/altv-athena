import { BaseVehicle } from './vehicleBase';
import { VehicleState } from './vehicleState';
import VehicleTuning from './vehicleTuning';

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
}
