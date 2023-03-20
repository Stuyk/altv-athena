import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { VEHICLE_LOCK_STATE } from '@AthenaShared/enums/vehicle';
import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

/**
 * Toggles a vehicle door lock.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {boolean} The new state of the lock. true = locked
 */
export function toggleLock(vehicle: alt.Vehicle): boolean {
    if (Overrides.toggleLock) {
        return Overrides.toggleLock(vehicle);
    }

    vehicle.lockState =
        (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED
            ? VEHICLE_LOCK_STATE.UNLOCKED
            : VEHICLE_LOCK_STATE.LOCKED;

    return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
}

/**
 * Toggles a vehicle engine.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {boolean} The new state of the engine. true = on
 */
export function toggleEngine(vehicle: alt.Vehicle): boolean {
    if (Overrides.toggleEngine) {
        return Overrides.toggleEngine(vehicle);
    }

    if (vehicle.driver) {
        vehicle.driver.emit(SYSTEM_EVENTS.VEHICLE_ENGINE, !vehicle.engineOn);
    } else {
        vehicle.engineOn = !vehicle.engineOn;
    }

    return vehicle.engineOn;
}

/**
 * Toggles a vehicle door.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {number} door
 * @return {boolean} The new state of the door. true = open
 */
export function toggleDoor(vehicle: alt.Vehicle, door: 0 | 1 | 2 | 3 | 4 | 5): boolean {
    if (Overrides.toggleDoor) {
        return Overrides.toggleDoor(vehicle, door);
    }

    const isClosed = vehicle.getDoorState(door) === 0 ? true : false;
    const doorState = isClosed === false ? 0 : 7;
    vehicle.setDoorState(door, doorState);

    return isClosed === false;
}

/**
 * Returns true if the vehicle is currently locked.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {*}
 */
export function isLocked(vehicle: alt.Vehicle) {
    if (Overrides.isLocked) {
        return Overrides.isLocked(vehicle);
    }

    return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
}

/**
 * Update the given vehicle in the database.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {*}
 */
export async function update(vehicle: alt.Vehicle) {
    if (Overrides.update) {
        return Overrides.update(vehicle);
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return;
    }

    if (data.state) {
        data.state = {
            ...data.state,
            bodyHealth: vehicle.bodyHealth,
            engineHealth: vehicle.engineHealth,
            engineOn: vehicle.engineOn,
            lockState: vehicle.lockState,
            lightState: vehicle.lightState,
            dirtLevel: vehicle.dirtLevel,
        };
    } else {
        data.state = {
            bodyHealth: vehicle.bodyHealth,
            engineHealth: vehicle.engineHealth,
            engineOn: vehicle.engineOn,
            lockState: vehicle.lockState,
            lightState: vehicle.lightState,
            dirtLevel: vehicle.dirtLevel,
        };
    }

    data.damage = Athena.vehicle.damage.get(vehicle);
    Athena.document.vehicle.setBulk(vehicle, { pos: vehicle.pos, rot: vehicle.rot, state: data.state });
}

interface VehicleControlFuncs {
    toggleLock: typeof toggleLock;
    toggleDoor: typeof toggleDoor;
    toggleEngine: typeof toggleEngine;
    update: typeof update;
    isLocked: typeof isLocked;
}

const Overrides: Partial<VehicleControlFuncs> = {};

export function override(functionName: 'toggleLock', callback: typeof toggleLock);
export function override(functionName: 'toggleDoor', callback: typeof toggleDoor);
export function override(functionName: 'toggleEngine', callback: typeof toggleEngine);
export function override(functionName: 'update', callback: typeof update);
export function override(functionName: 'isLocked', callback: typeof isLocked);
/**
 * Used to override vehicle control functionality
 *
 * @export
 * @param {keyof VehicleControlFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleControlFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
