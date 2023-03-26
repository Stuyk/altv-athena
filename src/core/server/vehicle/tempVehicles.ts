import * as alt from 'alt-server';

const tempVehicles: Array<number> = [];
const tempOwnedVehicles: { [vehicle_id: string]: number } = {};
const deleteOnLeave: { [vehicle_id: string]: true } = {};

/**
 * Register a vehicle as temporary
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {{ owner?: number; deleteOnLeave?: boolean }} options
 */
export function add(vehicle: alt.Vehicle, options: { owner?: number; deleteOnLeave?: boolean }) {
    if (Overrides.add) {
        return Overrides.add(vehicle, options);
    }

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
 *
 * @param {number} id
 */
export function remove(id: number): void {
    if (Overrides.remove) {
        return Overrides.remove(id);
    }

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
 *
 * @param {alt.Vehicle | number} vehicle
 * @return {boolean}
 */
export function has(vehicle: alt.Vehicle | number): boolean {
    if (Overrides.has) {
        return Overrides.has(vehicle);
    }

    const id = vehicle instanceof alt.Vehicle ? vehicle.id : vehicle;
    return tempVehicles.findIndex((x) => x === id) >= 0;
}

/**
 * Check if player is owner of a temporary vehicle.
 *
 *
 * @param {alt.Vehicle} player
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return
 */
export function isOwner(player: alt.Player, vehicle: alt.Vehicle): boolean {
    if (Overrides.isOwner) {
        return Overrides.isOwner(player, vehicle);
    }

    if (typeof tempOwnedVehicles[vehicle.id] === 'undefined') {
        return true;
    }

    return tempOwnedVehicles[vehicle.id] === player.id;
}

/**
 * Check if this vehicle should be removed when a player leaves the drivers seat.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {boolean}
 */
export function shouldBeDestroyed(vehicle: alt.Vehicle): boolean {
    if (Overrides.shouldBeDestroyed) {
        return Overrides.shouldBeDestroyed(vehicle);
    }

    return typeof deleteOnLeave[vehicle.id] !== 'undefined';
}

interface VehicleTempFuncs {
    add: typeof add;
    remove: typeof remove;
    has: typeof has;
    isOwner: typeof isOwner;
    shouldBeDestroyed: typeof shouldBeDestroyed;
}

const Overrides: Partial<VehicleTempFuncs> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'has', callback: typeof has);
export function override(functionName: 'isOwner', callback: typeof isOwner);
export function override(functionName: 'shouldBeDestroyed', callback: typeof shouldBeDestroyed);
/**
 * Used to override temporary vehicle functionality
 *
 *
 * @param {keyof VehicleTempFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleTempFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
