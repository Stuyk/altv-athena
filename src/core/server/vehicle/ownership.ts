import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';

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
 * @param {{ includePermissions?: boolean; includeKeys?: boolean; includeAdminOverride?: boolean; preventWhileAttached?: boolean; }}
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

/**
 * Add a character to the owned vehicle
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {alt.Player} player
 * @returns {Promise<boolean>}
 */
export async function addCharacter(vehicle: alt.Vehicle, player: alt.Player): Promise<boolean>;
/**
 * Add a character to the owned vehicle
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function addCharacter(vehicle: alt.Vehicle, id: string): Promise<boolean>;
/**
 * Add a character or player to the owned vehicle
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {(alt.Player | string)} playerOrId
 * @returns {Promise<boolean>}
 */
export async function addCharacter(vehicle: alt.Vehicle, playerOrId: alt.Player | string): Promise<boolean> {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    let _id: string;
    if (playerOrId instanceof alt.Player) {
        const playerData = Athena.document.character.get(playerOrId);
        if (typeof playerData === 'undefined') {
            return false;
        }

        _id = playerData._id.toString();
    }

    if (typeof playerOrId === 'string') {
        _id = playerOrId;
    }

    if (!data.keys) {
        data.keys = [];
    }

    const index = data.keys.findIndex((x) => x === _id);
    if (index <= -1) {
        data.keys.push(_id);
    }

    return await Database.updatePartialData(
        data._id.toString(),
        { keys: data.keys },
        Athena.database.collections.Vehicles,
    );
}

/**
 * Remove a character from the owned vehicle keys.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {(alt.Player | string)} playerOrId
 * @returns {Promise<boolean>}
 */
export async function removeCharacter(vehicle: alt.Vehicle, _id: string): Promise<boolean> {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    if (!data.keys) {
        data.keys = [];
    }

    const index = data.keys.findIndex((x) => x === _id);
    if (index <= -1) {
        return false;
    }

    data.keys.splice(index, 1);
    return await Database.updatePartialData(
        data._id.toString(),
        { keys: data.keys },
        Athena.database.collections.Vehicles,
    );
}
