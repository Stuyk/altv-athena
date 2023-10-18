import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle.js';

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

    const options = {
        includeKeys: true,
        includePermissions: true,
        includeGroupPermissions: true,
    };

    if (!Athena.vehicle.ownership.isOwner(player, vehicle, options)) {
        return false;
    }

    return true;
}

/**
 * Toggles a vehicle lock as if a player toggled it.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 */
export async function toggleLock(player: alt.Player, vehicle: alt.Vehicle) {
    if (Overrides.toggleLock) {
        return Overrides.toggleLock(player, vehicle);
    }

    if (!vehicle) {
        vehicle = player.vehicle;
    }

    if (!sharedOwnershipChecks(player, vehicle)) {
        return;
    }

    const isLocked = await Athena.vehicle.controls.toggleLock(vehicle);
    const soundName = isLocked ? 'car_unlock' : 'car_lock';
    Athena.player.emit.sound2D(player, soundName);

    const eventToEmit = isLocked ? 'doors-locked' : 'doors-unlocked';
    Athena.vehicle.events.trigger(eventToEmit, vehicle, player);
    Athena.vehicle.events.trigger('doors-lock-changed', vehicle, player);
}

/**
 * Toggles an engine lock as if a player toggled it.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {void}
 */
export async function toggleEngine(player: alt.Player, vehicle: alt.Vehicle) {
    if (Overrides.toggleEngine) {
        return Overrides.toggleEngine(player, vehicle);
    }

    if (!vehicle) {
        vehicle = player.vehicle;
    }

    if (!sharedOwnershipChecks(player, vehicle)) {
        return;
    }

    const newState = await Athena.vehicle.controls.toggleEngine(vehicle);
    const eventToEmit = newState ? 'engine-started' : 'engine-stopped';
    Athena.vehicle.events.trigger(eventToEmit, vehicle, player);
}

/**
 * Toggles a door lock as if a player toggled it.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {number} door
 */
export async function toggleDoor(player: alt.Player, vehicle: alt.Vehicle, door: 0 | 1 | 2 | 3 | 4 | 5) {
    if (Overrides.toggleDoor) {
        return Overrides.toggleDoor(player, vehicle, door);
    }

    if (!vehicle) {
        vehicle = player.vehicle;
    }

    if (typeof door !== 'number') {
        return;
    }

    if (!sharedOwnershipChecks(player, vehicle)) {
        return;
    }

    if (Athena.vehicle.controls.isLocked(vehicle)) {
        return;
    }

    const newState = await Athena.vehicle.controls.toggleDoor(vehicle, door);
    const eventToEmit = newState ? 'door-opened' : 'door-closed';
    Athena.vehicle.events.trigger(eventToEmit, vehicle, door, player);
}

alt.onClient(VEHICLE_EVENTS.SET_LOCK, toggleLock);
alt.onClient(VEHICLE_EVENTS.SET_ENGINE, toggleEngine);
alt.onClient(VEHICLE_EVENTS.SET_DOOR, toggleDoor);

interface VehicleAsPlayerFuncs {
    toggleLock: typeof toggleLock;
    toggleDoor: typeof toggleDoor;
    toggleEngine: typeof toggleEngine;
}

const Overrides: Partial<VehicleAsPlayerFuncs> = {};

export function override(functionName: 'toggleLock', callback: typeof toggleLock);
export function override(functionName: 'toggleDoor', callback: typeof toggleDoor);
export function override(functionName: 'toggleEngine', callback: typeof toggleEngine);
/**
 * Used to override vehicle control as a player functionality
 *
 *
 * @param {keyof VehicleAsPlayerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleAsPlayerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
