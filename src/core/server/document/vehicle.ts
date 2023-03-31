import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { KnownKeys } from '@AthenaShared/utility/knownKeys';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';
import Database from '@stuyk/ezmongodb';

export type KeyChangeCallback = (vehicle: alt.Vehicle, newValue: any, oldValue: any) => void;

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const cache: { [id: string]: OwnedVehicle } = {};
const DEBUG_MODE = false;

/**
 * Used to unbind vehicle cache for an id once the vehicle is deleted
 *
 * @param {number} id
 */
export function unbind(id: number) {
    if (Overrides.unbind) {
        return Overrides.unbind(id);
    }

    delete cache[id];
}

/**
 * Used to bind a vehicle document to a vehicle entity
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {OwnedVehicle} document
 */
export function bind(vehicle: alt.Vehicle, document: OwnedVehicle) {
    if (Overrides.bind) {
        return Overrides.bind(vehicle, document);
    }

    if (document._id) {
        document._id = document._id.toString();
    }

    cache[vehicle.id] = document;
}

/**
 * Get a vehicle document attached to a vehicle
 *
 * @template T
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(T | undefined)}
 */
export function get<T = OwnedVehicle>(vehicle: alt.Vehicle): T | undefined {
    if (Overrides.get) {
        return Overrides.get(vehicle);
    }

    return cache[vehicle.id] as T;
}

/**
 * Get a field directly for a vehicle document
 *
 * @template T
 * @template ReturnType
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {(keyof KnownKeys<OwnedVehicle & T>)} fieldName
 * @return {(ReturnType | undefined)}
 */
export function getField<T = {}, ReturnType = any>(
    vehicle: alt.Vehicle,
    fieldName: keyof KnownKeys<OwnedVehicle & T>,
): ReturnType | undefined {
    if (Overrides.getField) {
        return Overrides.getField(vehicle, fieldName);
    }

    if (!cache[vehicle.id]) {
        return undefined;
    }

    return cache[vehicle.id][String(fieldName)];
}

/**
 * Set vehicle data for a given field, automatically saves to database.
 *
 * @template T
 * @template Keys
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {Keys} fieldName
 * @param {*} value
 * @param {boolean} [skipCallbacks=false]
 * @return {void}
 */
export async function set<T = {}, Keys = keyof KnownKeys<OwnedVehicle & T>>(
    vehicle: alt.Vehicle,
    fieldName: Keys,
    value: any,
    skipCallbacks = false,
) {
    if (Overrides.set) {
        return Overrides.set(vehicle, fieldName, value, skipCallbacks);
    }

    if (!cache[vehicle.id]) {
        return undefined;
    }

    const typeSafeFieldName = String(fieldName);
    let oldValue = undefined;
    if (cache[vehicle.id][typeSafeFieldName]) {
        oldValue = JSON.parse(JSON.stringify(cache[vehicle.id][typeSafeFieldName]));
    }

    const newData = { [typeSafeFieldName]: value };

    cache[vehicle.id] = Object.assign(cache[vehicle.id], newData);
    await Database.updatePartialData(cache[vehicle.id]._id, newData, Athena.database.collections.Vehicles);

    if (DEBUG_MODE) {
        alt.logWarning(
            `DEBUG: ${cache[vehicle.id]._id} state updated for ${typeSafeFieldName} with value: ${JSON.stringify(
                newData,
            )}`,
        );
    }

    if (typeof callbacks[typeSafeFieldName] === 'undefined') {
        return;
    }

    if (skipCallbacks) {
        return;
    }

    for (let cb of callbacks[typeSafeFieldName]) {
        cb(vehicle, value, oldValue);
    }
}

/**
 * Set bulk data for a vehicle document.
 * Automatically saves to database.
 *
 * @template T
 * @template Keys
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {Keys} fields
 */
export async function setBulk<T = {}, Keys = Partial<OwnedVehicle & T>>(vehicle: alt.Vehicle, fields: Keys) {
    if (Overrides.setBulk) {
        return Overrides.setBulk(vehicle, fields);
    }

    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        oldValues[key] = JSON.parse(JSON.stringify(cache[vehicle.id][key]));
    });

    cache[vehicle.id] = Object.assign(cache[vehicle.id], fields);
    await Database.updatePartialData(cache[vehicle.id]._id, fields, Athena.database.collections.Vehicles);

    Object.keys(fields).forEach((key) => {
        if (typeof callbacks[key] === 'undefined') {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(vehicle, cache[vehicle.id][key], oldValues[key]);
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
export function onChange<T = {}>(fieldName: keyof KnownKeys<OwnedVehicle & T>, callback: KeyChangeCallback) {
    if (Overrides.onChange) {
        return Overrides.onChange(fieldName, callback);
    }

    const actualFieldName = String(fieldName);

    if (typeof callbacks[actualFieldName] === 'undefined') {
        callbacks[actualFieldName] = [callback];
    } else {
        callbacks[actualFieldName].push(callback);
    }
}

/**
 * Check if a vehicle document already exists and a vehicle is attached to it.
 *
 *
 * @param {string} _id
 * @return {boolean}
 */
export function exists(_id: string): boolean {
    return Object.values(cache).find((x) => x._id.toString() === _id.toString()) !== undefined;
}

alt.on('removeEntity', (entity: alt.Entity) => {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    unbind(entity.id);
});

interface VehicleDocFuncs {
    bind: typeof bind;
    unbind: typeof unbind;
    exists: typeof exists;
    get: typeof get;
    getField: typeof getField;
    set: typeof set;
    setBulk: typeof setBulk;
    onChange: typeof onChange;
}

const Overrides: Partial<VehicleDocFuncs> = {};

export function override(functionName: 'exists', callback: typeof exists);
export function override(functionName: 'bind', callback: typeof bind);
export function override(functionName: 'unbind', callback: typeof unbind);
export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'getField', callback: typeof getField);
export function override(functionName: 'set', callback: typeof set);
export function override(functionName: 'setBulk', callback: typeof setBulk);
export function override(functionName: 'onChange', callback: typeof onChange);

/**
 * Used to override any vehicle document functionality
 *
 *
 * @param {keyof VehicleDocFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleDocFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
