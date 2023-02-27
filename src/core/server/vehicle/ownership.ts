import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

/**
 * A catch all handler for vehicle ownership.
 *
 * This checks if a player is the true owner of a vehicle.
 *
 * Options can be specified to check if a passenger has keys and so on and so forth.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @param {{ includePermissions?: boolean; includeKeys?: boolean; includeAdminOverride?: boolean; preventWhileAttached?: boolean; }} [options={}]
 * @return {boolean}
 */
export function isOwner(
    player: alt.Player,
    vehicle: alt.Vehicle,
    options: {
        includePermissions?: boolean;
        includeKeys?: boolean;
        includeAdminOverride?: boolean;
        preventWhileAttached?: boolean;
    } = {},
): boolean {
    if (options.preventWhileAttached && vehicle.attached) {
        return false;
    }

    if (Athena.vehicle.tempVehicles.has(vehicle)) {
        return Athena.vehicle.tempVehicles.isOwner(player, vehicle);
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    const playerData = Athena.document.character.get(player);
    if (typeof playerData === 'undefined') {
        return false;
    }

    if (options.includeAdminOverride && Athena.systems.permission.has('account', player, 'admin')) {
        return true;
    }

    if (options.includePermissions && Athena.vehicle.ownership.hasPermission(player, vehicle)) {
        return true;
    }

    if (options.includeKeys && Athena.vehicle.ownership.hasKeys(player, vehicle)) {
        return true;
    }

    return data.owner === playerData._id;
}

/**
 * Checks if a player's character has a matching permission for a vehicle.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @return {boolean}
 */
export function hasPermission(player: alt.Player, vehicle: alt.Vehicle): boolean {
    if (Athena.vehicle.tempVehicles.has(vehicle)) {
        return false;
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    return Athena.systems.permission.hasOne('character', player, data.permissions);
}

/**
 * Checks if a player's character has a matching permission for a vehicle.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @return {boolean}
 */
export function hasKeys(player: alt.Player, vehicle: alt.Vehicle): boolean {
    if (Athena.vehicle.tempVehicles.has(vehicle)) {
        return false;
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    const playerData = Athena.document.character.get(player);
    if (typeof playerData === 'undefined') {
        return false;
    }

    return data.keys.findIndex((x) => x === playerData._id) >= 0;
}

/**
 * Return the owner of a vehicle's database identifier
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {(string | undefined)}
 */
export function get(vehicle: alt.Vehicle): string | undefined {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return undefined;
    }

    return data.owner;
}

/**
 * Return the owner of a vehicle based on player
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {(alt.Player | undefined)}
 */
export function getAsPlayer(vehicle: alt.Vehicle): alt.Player | undefined {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return undefined;
    }

    return Athena.getters.player.byDatabaseID(data.owner);
}
