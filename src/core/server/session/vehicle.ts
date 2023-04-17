import * as alt from 'alt-server';

const sessionStorage: { [id: string]: { [key: string]: any } } = {};

declare global {
    namespace AthenaSession {
        export interface Vehicle {
            example: boolean;
        }
    }
}

/**
 * Set data for a vehicle's session
 *
 * This data is not persistent, and automatically clears on disconnect / vehicle destroy
 *
 * #### Example
 * ```ts
 * declare global {
 *     namespace AthenaSession {
 *         export interface Vehicle {
 *             myCustomValue: boolean;
 *         }
 *     }
 * }
 *
 * Athena.session.vehicle.set(someVehicle, 'myCustomValue', true);
 * ```
 *
 * @param {alt.Vehicle} vehicle
 * @param {keyof AthenaSession.Vehicle} key The key you want to put the value under
 * @param {AthenaSession.Vehicle[K]} value The value you want to set
 * @returns {any} Any type of value, can be specified with a generic type.
 */
export function set<K extends keyof AthenaSession.Vehicle>(
    vehicle: alt.Vehicle,
    key: keyof AthenaSession.Vehicle,
    value: AthenaSession.Vehicle[K],
) {
    if (!vehicle || !vehicle.valid) {
        return;
    }

    if (!sessionStorage[vehicle.id]) {
        sessionStorage[vehicle.id] = {};
    }

    sessionStorage[vehicle.id][key] = value;
}

/**
 * Returns true, if it has any value set for a given key.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {string} key
 */
export function has(vehicle: alt.Vehicle, key: string) {
    if (!vehicle || !vehicle.valid) {
        return false;
    }

    if (!sessionStorage[vehicle.id]) {
        return false;
    }

    return typeof sessionStorage[vehicle.id][key] !== 'undefined' ? true : false;
}

/**
 * Retrieve data from a vehicle's session storage.
 *
 * @param vehicle
 * @param {keyof AthenaSession.Vehicle} key The value you want to get from the vehicle.
 * @returns {AthenaSession.Vehicle[K]} Any type of value, can be specified with a generic type.
 */
export function get<K extends keyof AthenaSession.Vehicle>(
    vehicle: alt.Vehicle,
    key: K,
): AthenaSession.Vehicle[K] | undefined {
    if (!vehicle || !vehicle.valid) {
        return undefined;
    }

    if (typeof sessionStorage[vehicle.id] === 'undefined') {
        return undefined;
    }

    return sessionStorage[vehicle.id][key];
}

/**
 * Clear a key from the vehicle.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {string} key
 */
export function clearKey(vehicle: alt.Vehicle | number, key: keyof AthenaSession.Vehicle) {
    if (vehicle instanceof alt.Vehicle) {
        if (!vehicle || !vehicle.valid) {
            return;
        }

        vehicle = vehicle.id;
    }

    if (typeof sessionStorage[vehicle] === 'undefined') {
        return;
    }

    delete sessionStorage[vehicle][key];
}

/**
 * Clear all keys, and remove all data for a session.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 */
export function clearAll(vehicle: alt.Vehicle) {
    if (!vehicle || !vehicle.valid) {
        return;
    }

    if (typeof sessionStorage[vehicle.id] === 'undefined') {
        return;
    }

    delete sessionStorage[vehicle.id];
}

/**
 * Get all vehicles's that have a specific key.
 *
 * @export
 * @param {string} key
 */
export function getAll<K extends keyof AthenaSession.Vehicle>(key: K): Array<AthenaSession.Vehicle[K]> {
    return Object.values(sessionStorage).filter((x) => x[key]) as Array<AthenaSession.Vehicle[K]>;
}

alt.on('vehicleDestroy', clearAll);
