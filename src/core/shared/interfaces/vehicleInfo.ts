import { FUEL_TYPE, VEHICLE_CLASS, VEHICLE_TYPE } from '../enums/vehicleTypeFlags';

/**
 * Interface for working with / using vehicles.
 *
 *
 * @interface VehicleInfo
 */
export interface VehicleInfo {
    /**
     * The display name of the vehicle.
     * @type {string}
     *
     */
    display: string;

    /**
     * The model of the vehicle.
     * @type {string}
     *
     */
    name: string;

    /**
     * The vehicle type; vehicle, boat, plane, etc.
     * @type {VEHICLE_TYPE}
     *
     */
    type: VEHICLE_TYPE;

    /**
     * The class of the vehicle; sport, utility, etc.
     * @type {VEHICLE_CLASS}
     *
     */
    class: VEHICLE_CLASS;

    /**
     * Is this vehicle purchaseable?
     * @type {boolean}
     *
     */
    sell: boolean;

    /**
     * The price of this vehicle if purchaseable.
     * @type {number}
     *
     */
    price: number;

    /**
     * How much storage this vehicle should have.
     * @type {(number | null)}
     *
     */
    storage: number | null;

    /**
     * The type of fuel the vehicle uses
     * @type {FUEL_TYPE}
     *
     */
    fuelType: FUEL_TYPE;

    /**
     * The total tanksize of the vehicle used for fuel cost calculations
     * @type {number}
     *
     */
    fuelTankSize?: number;

    /**
     * The total number of available seats in a vehicle
     * @type {number}
     *
     */
    seats?: number;
}
