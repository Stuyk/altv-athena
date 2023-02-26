import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle';

function sharedOwnershipChecks(player: alt.Player, vehicle: alt.Vehicle) {
    if (!vehicle || !vehicle.valid) {
        return false;
    }

    if (Athena.getters.player.isDead(player)) {
        return false;
    }

    if (!Athena.getters.player.isValid(player)) {
        return false;
    }

    if (!Athena.vehicle.ownership.isOwner(player, vehicle, { includeKeys: true, includePermissions: true })) {
        return false;
    }

    return true;
}

/**
 * Toggles a vehicle lock as if a player toggled it.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @return {*}
 */
export function toggleLock(player: alt.Player, vehicle: alt.Vehicle) {
    if (!sharedOwnershipChecks(player, vehicle)) {
        return;
    }

    const newState = Athena.vehicle.controls.toggleLock(vehicle);
    const eventToEmit = newState ? 'doors-locked' : 'doors-unlocked';
    Athena.vehicle.events.trigger(eventToEmit, vehicle, player);
}

/**
 * Toggles an engine lock as if a player toggled it.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @return {*}
 */
export function toggleEngine(player: alt.Player, vehicle: alt.Vehicle) {
    if (!sharedOwnershipChecks(player, vehicle)) {
        return;
    }

    const newState = Athena.vehicle.controls.toggleEngine(vehicle);
    const eventToEmit = newState ? 'engine-started' : 'engine-stopped';
    Athena.vehicle.events.trigger(eventToEmit, vehicle, player);
}

/**
 * Toggles a door lock as if a player toggled it.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @param {number} door
 * @return {*}
 */
export function toggleDoor(player: alt.Player, vehicle: alt.Vehicle, door: number) {
    if (typeof door !== 'number') {
        return;
    }

    if (!sharedOwnershipChecks(player, vehicle)) {
        return;
    }

    const newState = Athena.vehicle.controls.toggleDoor(vehicle, door);
    const eventToEmit = newState ? 'door-opened' : 'door-closed';
    Athena.vehicle.events.trigger(eventToEmit, vehicle, door, player);
}

alt.onClient(VEHICLE_EVENTS.SET_LOCK, toggleLock);
alt.onClient(VEHICLE_EVENTS.SET_ENGINE, toggleEngine);
alt.onClient(VEHICLE_EVENTS.SET_DOOR, toggleDoor);
