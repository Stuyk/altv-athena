import * as alt from 'alt-server';
import { KnownKeys } from '@AthenaShared/utility/knownKeys';
import { databaseConst as Database } from '@AthenaServer/api/consts/constDatabase';
import { IVehicle } from '@AthenaShared/interfaces/iVehicle';

type KeyChangeCallback = (vehicle: alt.Vehicle, newValue: any, oldValue: any) => void;

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};

/**
 * Return current vehicle data and their associated vehicle object.
 *
 * @template T
 * @param {alt.Vehicle} vehicle
 * @return {T = Vehicle}
 */
function get<T = IVehicle>(vehicle: alt.Vehicle): T | undefined {
    if (typeof vehicle.data === 'undefined' || !vehicle.data._id) {
        alt.logWarning(`Cannot fetch data for Vehicle (${vehicle.id}) it is not a document supported vehicle.`);
        return undefined;
    }

    return vehicle.data as T;
}

/**
 * Get the current value of a specific field inside of the vehicle data object.
 * Can be extended to obtain any value easily.
 *
 * @template T
 * @param {alt.Vehicle} vehicle
 * @param {(keyof KnownKeys<Vehicle & T>)} fieldName
 * @return {*}
 */
function getField<T = {}>(vehicle: alt.Vehicle, fieldName: keyof KnownKeys<IVehicle & T>) {
    if (typeof vehicle.data === 'undefined' || !vehicle.data._id) {
        alt.logWarning(`Cannot fetch data for Vehicle (${vehicle.id}) it is not a document supported vehicle.`);
        return undefined;
    }

    return vehicle.data[String(fieldName)];
}

/**
 * Sets a vehicle document value, and saves it automatically to the selected vehicles's database.
 * Automatically calls all callbacks associated with the field name.
 *
 * @template T
 * @param {alt.Vehicle} vehicle
 * @param {(keyof KnownKeys<IVehicle & T>)} fieldName
 * @param {*} value
 * @return {void}
 */
async function set<T = {}>(vehicle: alt.Vehicle, fieldName: keyof KnownKeys<IVehicle & T>, value: any) {
    if (typeof vehicle.data === 'undefined' || !vehicle.data._id) {
        alt.logWarning(`Cannot set data for Vehicle (${vehicle.id}) it is not a document supported vehicle.`);
        return undefined;
    }

    const typeSafeFieldName = String(fieldName);
    const oldValue = JSON.parse(JSON.stringify(vehicle.data[typeSafeFieldName]));
    const newData = { [typeSafeFieldName]: value };

    vehicle.data = Object.assign(vehicle.data, newData);
    await Database.funcs.updatePartialData(vehicle.data._id, newData, Database.collections.Vehicles);

    if (typeof callbacks[typeSafeFieldName] === 'undefined') {
        return;
    }

    for (let cb of callbacks[typeSafeFieldName]) {
        cb(vehicle, value, oldValue);
    }
}

/**
 * Sets vehicle document values, and saves it automatically to the selected vehicles's database.
 * Automatically calls all callbacks associated with the field name.
 *
 * @template T
 * @param {alt.Vehicle} vehicle
 * @param {(Partial<IVehicle & T>)} fields
 * @returns {void}
 */
async function setBulk<T = {}>(vehicle: alt.Vehicle, fields: Partial<IVehicle & T>) {
    if (typeof vehicle.data === 'undefined' || !vehicle.data._id) {
        alt.logWarning(`Cannot set bulk data for Vehicle (${vehicle.id}) it is not a document supported vehicle.`);
        return undefined;
    }

    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        oldValues[key] = JSON.parse(JSON.stringify(vehicle.data[key]));
    });

    vehicle.data = Object.assign(vehicle.data, fields);
    await Database.funcs.updatePartialData(vehicle.data._id, fields, Database.collections.Vehicles);

    Object.keys(oldValues).forEach((key) => {
        if (typeof callbacks[key] === 'undefined') {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(vehicle, fields[key], oldValues[key]);
        }
    });
}

/**
 * Listen for individual vehicle document changes.
 *
 * @param {string} fieldName
 * @param {KeyChangeCallback} callback
 * @return {void}
 */
function onChange<T = {}>(fieldName: keyof KnownKeys<IVehicle & T>, callback: KeyChangeCallback) {
    const actualFieldName = String(fieldName);

    if (typeof callbacks[actualFieldName] === 'undefined') {
        callbacks[actualFieldName] = [callback];
    } else {
        callbacks[actualFieldName].push(callback);
    }
}

export const VehicleDocument = {
    get,
    getField,
    set,
    setBulk,
    onChange,
};
