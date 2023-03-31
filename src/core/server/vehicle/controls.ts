import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { VEHICLE_LOCK_STATE } from '@AthenaShared/enums/vehicle';
import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

/**
 * Toggles a vehicle door lock.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {boolean} The new state of the lock. true = locked
 */
export async function toggleLock(vehicle: alt.Vehicle): Promise<boolean> {
    if (Overrides.toggleLock) {
        return Overrides.toggleLock(vehicle);
    }

    vehicle.lockState =
        (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED
            ? VEHICLE_LOCK_STATE.UNLOCKED
            : VEHICLE_LOCK_STATE.LOCKED;

    updateLastUsed(vehicle);

    return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
}

/**
 * Toggles a vehicle engine.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {boolean} The new state of the engine. true = on
 */
export async function toggleEngine(vehicle: alt.Vehicle): Promise<boolean> {
    if (Overrides.toggleEngine) {
        return Overrides.toggleEngine(vehicle);
    }

    if (!vehicle.engineOn && vehicle.engineHealth <= 100) {
        return false;
    }

    if (vehicle.driver) {
        vehicle.driver.emit(SYSTEM_EVENTS.VEHICLE_ENGINE, !vehicle.engineOn);
    } else {
        vehicle.engineOn = !vehicle.engineOn;
    }

    await updateLastUsed(vehicle);

    return vehicle.engineOn;
}

/**
 * Toggles a vehicle door.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {number} door
 * @return {boolean} The new state of the door. true = open
 */
export async function toggleDoor(vehicle: alt.Vehicle, door: 0 | 1 | 2 | 3 | 4 | 5): Promise<boolean> {
    if (Overrides.toggleDoor) {
        return Overrides.toggleDoor(vehicle, door);
    }

    const isClosed = vehicle.getDoorState(door) === 0 ? true : false;
    const doorState = isClosed === false ? 0 : 7;
    vehicle.setDoorState(door, doorState);

    updateLastUsed(vehicle);

    return isClosed === false;
}

/**
 * Returns true if the vehicle is currently locked.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {void}
 */
export function isLocked(vehicle: alt.Vehicle): boolean {
    if (Overrides.isLocked) {
        return Overrides.isLocked(vehicle);
    }

    return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
}

/**
 * Update the given vehicle in the database.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {void}
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
    Athena.document.vehicle.setBulk(vehicle, {
        pos: vehicle.pos,
        rot: vehicle.rot,
        state: data.state,
        damage: data.damage,
    });
}

/**
 * Update the vehicle's last used value.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {void}
 */
export async function updateLastUsed(vehicle: alt.Vehicle): Promise<void> {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return;
    }

    await Athena.document.vehicle.set(vehicle, 'lastUsed', Date.now());
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
 *
 * @param {keyof VehicleControlFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleControlFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
