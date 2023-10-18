import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import { KnownKeys } from '@AthenaShared/utility/knownKeys.js';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned.js';
import Database from '@stuyk/ezmongodb';

export type KeyChangeCallback = (vehicle: alt.Vehicle, newValue: any, oldValue: any) => void;

const SessionKey = 'athena-document-vehicle-data';

declare global {
    namespace AthenaSession {
        interface Vehicle {
            [SessionKey]: OwnedVehicle;
        }
    }
}

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};

/**
 * Used to unbind vehicle cache for an id once the vehicle is deleted
 *
 * @param {number} id
 */
export function unbind(id: number) {
    if (Overrides.unbind) {
        return Overrides.unbind(id);
    }

    Athena.session.vehicle.clearKey(id, SessionKey);
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

    Athena.session.vehicle.set(vehicle, SessionKey, document);
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

    return <T>Athena.session.vehicle.get(vehicle, SessionKey);
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

    if (!Athena.session.vehicle.has(vehicle, SessionKey)) {
        return undefined;
    }

    return Athena.session.vehicle.get(vehicle, SessionKey)[String(fieldName)];
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

    if (!Athena.session.vehicle.get(vehicle, SessionKey)) {
        return undefined;
    }

    const typeSafeFieldName = String(fieldName);
    let oldValue = undefined;
    let data = Athena.session.vehicle.get(vehicle, SessionKey);
    if (data[typeSafeFieldName]) {
        oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
    }

    const newData = { [typeSafeFieldName]: value };

    data = Object.assign(data, newData);
    Athena.session.vehicle.set(vehicle, SessionKey, data);
    await Database.updatePartialData(data._id, newData, Athena.database.collections.Vehicles);

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
    let data = Athena.session.vehicle.get(vehicle, SessionKey);

    Object.keys(fields).forEach((key) => {
        if (typeof data[key] === 'undefined') {
            oldValues[key] = undefined;
            return;
        }

        oldValues[key] = JSON.parse(JSON.stringify(data[key]));
    });

    data = Object.assign(data, fields);
    Athena.session.vehicle.set(vehicle, SessionKey, data);
    await Database.updatePartialData(data._id, fields, Athena.database.collections.Vehicles);

    Object.keys(fields).forEach((key) => {
        if (typeof callbacks[key] === 'undefined') {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(vehicle, data[key], oldValues[key]);
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
 * Return all available vehicles, and their associated alt:V vehicle ids.
 *
 * The vehicle can be fetched with alt.Vehicle.all.find(x => x.id === someResult.id);
 *
 * @export
 * @template T
 * @return {(Array<{ id: number; document: OwnedVehicle & T }>)}
 */
export function getAllOnline<T = {}>(): Array<{ id: number; document: OwnedVehicle & T }> {
    const dataSet: Array<{ id: number; document: OwnedVehicle & T }> = [];

    for (let vehicle of alt.Vehicle.all) {
        const data = Athena.session.vehicle.get(vehicle, SessionKey);
        if (typeof data === 'undefined') {
            continue;
        }

        dataSet.push({ id: vehicle.id, document: data as OwnedVehicle & T });
    }

    return dataSet;
}

/**
 * Check if a vehicle document already exists and a vehicle is attached to it.
 *
 * @param {string} _id
 * @return {boolean}
 */
export function exists(_id: string): boolean {
    const sessions = Athena.session.vehicle.getAll(SessionKey);
    return sessions.find((x) => x && x._id && x._id.toString() === _id) ? true : false;
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
