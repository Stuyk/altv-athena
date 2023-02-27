import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { VEHICLE_LOCK_STATE } from '@AthenaShared/enums/vehicle';
import * as alt from 'alt-server';

/**
 * Toggles a vehicle door lock.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {boolean} The new state of the lock. true = locked
 */
export function toggleLock(vehicle: alt.Vehicle): boolean {
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
export function toggleDoor(vehicle: alt.Vehicle, door: number): boolean {
    //

    let status = false;

    return status;
}

export function update(vehicle: alt.Vehicle) {
    //
}
