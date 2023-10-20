import IVehicleMod from './vehicleMod.js';

/**
 * Tuning to apply to an owned vehicle.
 *
 *
 * @interface IVehicleTuning
 */
export interface IVehicleTuning {
    /**
     * Cannot exceed modkit count
     *
     * @type {number}
     *
     */
    modkit: number;

    /**
     * Mods to apply to this vehicle
     *
     * @type {Array<IVehicleMod>}
     *
     */
    mods: Array<IVehicleMod>;

    /**
     * Handling data to apply to this vehicle
     *
     * @type {Partial<IVehicleHandling>}
     *
     */
    // handling: Partial<IVehicleHandling>;
}

export default IVehicleTuning;
