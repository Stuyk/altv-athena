import * as alt from 'alt-server';

const tempVehicles: Array<number> = [];
const tempOwnedVehicles: { [vehicle_id: string]: number } = {};
const deleteOnLeave: { [vehicle_id: string]: true } = {};

/**
 * Register a vehicle as temporary
 *
 * @export
 * @param {alt.Vehicle} vehicle
 */
export function add(vehicle: alt.Vehicle, options: { owner?: number; deleteOnLeave?: boolean }) {
    tempVehicles.push(vehicle.id);

    if (typeof options.owner !== 'undefined') {
        tempOwnedVehicles[vehicle.id] = options.owner;
    }

    if (options.deleteOnLeave) {
        deleteOnLeave[vehicle.id] = true;
    }
}

/**
 * Removes a temporary vehicle from the tracker.
 *
 * @export
 * @param {number} id
 */
export function remove(id: number) {
    for (let i = tempVehicles.length - 1; i >= 0; i--) {
        if (tempVehicles[i] !== id) {
            continue;
        }

        tempVehicles.splice(i, 1);
    }

    delete tempOwnedVehicles[id];
    delete deleteOnLeave[id];
}

/**
 * Check if a vehicle is temporary by id, or vehicle instance.
 *
 * @export
 * @param {alt.Vehicle | number} vehicle
 * @return {*}
 */
export function has(vehicle: alt.Vehicle | number) {
    const id = vehicle instanceof alt.Vehicle ? vehicle.id : vehicle;
    return tempVehicles.findIndex((x) => x === id) >= 0;
}

/**
 * Check if this vehicle should be removed when a player leaves the drivers seat.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {*}
 */
export function shouldBeDestroyed(vehicle: alt.Vehicle) {
    return deleteOnLeave[vehicle.id];
}
