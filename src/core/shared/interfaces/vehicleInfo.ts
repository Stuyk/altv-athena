import { FUEL_TYPE, VEHICLE_CLASS, VEHICLE_TYPE } from '../enums/vehicleTypeFlags';

/**
 * Interface for working with / using vehicles.
 * @export
 * @interface VehicleInfo
 */
export interface VehicleInfo {
    /**
     * The display name of the vehicle.
     * @type {string}
     * @memberof VehicleInfo
     */
    display: string;

    /**
     * The model of the vehicle.
     * @type {string}
     * @memberof VehicleInfo
     */
    name: string;

    /**
     * The display name of the manufacturer of the vehicle.
     * @type {string}
     * @memberof VehicleInfo
     */
    manufacturerDisplay: string;

    /**
     * The manufacturer of the vehicle.
     * @type {string}
     * @memberof VehicleInfo
     */
    manufacturer: string;

    /**
     * The vehicle type; vehicle, boat, plane, etc.
     * @type {VEHICLE_TYPE}
     * @memberof VehicleInfo
     */
    type: VEHICLE_TYPE;

    /**
     * The class of the vehicle; sport, utility, etc.
     * @type {VEHICLE_CLASS}
     * @memberof VehicleInfo
     */
    class: VEHICLE_CLASS;

    /**
     * Is this vehicle purchaseable?
     * @type {boolean}
     * @memberof VehicleInfo
     */
    sell: boolean;

    /**
     * The price of this vehicle if purchaseable.
     * @type {number}
     * @memberof VehicleInfo
     */
    price: number;

    /**
     * How much storage this vehicle should have.
     * @type {(number | null)}
     * @memberof VehicleInfo
     */
    storage: number | null;

    /**
     * The type of fuel the vehicle uses
     * @type {FUEL_TYPE}
     * @memberof VehicleInfo
     */
    fuelType: FUEL_TYPE;

    /**
     * The model hash of this vehicle.
     * @type {number}
     * @memberof VehicleInfo
     */
    hash: number;

    /**
     * The signed model hash of this vehicle.
     * @type {number}
     * @memberof VehicleInfo
     */
    signedHash?: number;

    /**
     * The hex model hash of this vehicle.
     * @type {string}
     * @memberof VehicleInfo
     */
    hexHash?: string;

    /**
     * The total tanksize of the vehicle used for fuel cost calculations
     * @type {number}
     * @memberof VehicleInfo
     */
    fuelTankSize?: number;

    /**
     * The total number of available seats in a vehicle
     * @type {number}
     * @memberof VehicleInfo
     */
    seats?: number;
}
