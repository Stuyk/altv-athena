import * as alt from 'alt-server';
import { KnownKeys } from '@AthenaShared/utility/knownKeys';
import { databaseConst as Database } from '@AthenaServer/api/consts/constDatabase';
import { IVehicle } from '@AthenaShared/interfaces/iVehicle';

type KeyChangeCallback = (vehicle: alt.Vehicle, newValue: any, oldValue: any) => void;

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const cache: { [id: string]: IVehicle } = {};
const DEBUG_MODE = false;

/**
 * Used to unbind vehicle cache for an id once the vehicle is deleted
 *
 * @param {number} id
 */
function unbind(id: number) {
    delete cache[id];
}

/**
 * Used to bind a vehicle document to a vehicle entity
 *
 * @param {alt.Vehicle} vehicle
 * @param {IVehicle} document
 */
function bind(vehicle: alt.Vehicle, document: IVehicle) {
    if (document._id) {
        document._id = document._id.toString();
    }

    cache[vehicle.id] = document;
}

/**
 * Get a vehicle document attached to a vehicle
 *
 * @template T
 * @param {alt.Vehicle} vehicle
 * @return {(T | undefined)}
 */
function get<T = IVehicle>(vehicle: alt.Vehicle): T | undefined {
    return cache[vehicle.id] as T;
}

/**
 * Get a field directly for a vehicle document
 *
 * @template T
 * @template ReturnType
 * @param {alt.Vehicle} vehicle
 * @param {(keyof KnownKeys<IVehicle & T>)} fieldName
 * @return {(ReturnType | undefined)}
 */
function getField<T = {}, ReturnType = any>(
    vehicle: alt.Vehicle,
    fieldName: keyof KnownKeys<IVehicle & T>,
): ReturnType | undefined {
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
 * @param {alt.Vehicle} vehicle
 * @param {Keys} fieldName
 * @param {*} value
 * @param {boolean} [skipCallbacks=false]
 * @return {*}
 */
async function set<T = {}, Keys = keyof KnownKeys<IVehicle & T>>(
    vehicle: alt.Vehicle,
    fieldName: Keys,
    value: any,
    skipCallbacks = false,
) {
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
    await Database.funcs.updatePartialData(cache[vehicle.id]._id, newData, Database.collections.Vehicles);

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
 * @param {alt.Vehicle} vehicle
 * @param {Keys} fields
 */
async function setBulk<T = {}, Keys = Partial<IVehicle & T>>(vehicle: alt.Vehicle, fields: Keys) {
    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        oldValues[key] = JSON.parse(JSON.stringify(cache[vehicle.id][key]));
    });

    cache[vehicle.id] = Object.assign(cache[vehicle.id], fields);
    await Database.funcs.updatePartialData(cache[vehicle.id]._id, fields, Database.collections.Vehicles);

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
function onChange<T = {}>(fieldName: keyof KnownKeys<IVehicle & T>, callback: KeyChangeCallback) {
    const actualFieldName = String(fieldName);

    if (typeof callbacks[actualFieldName] === 'undefined') {
        callbacks[actualFieldName] = [callback];
    } else {
        callbacks[actualFieldName].push(callback);
    }
}

export const VehicleDocument = {
    bind,
    get,
    getField,
    onChange,
    set,
    setBulk,
    unbind,
};

alt.on('removeEntity', (entity: alt.Entity) => {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    unbind(entity.id);
});
