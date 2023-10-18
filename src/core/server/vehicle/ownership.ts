import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import Database from '@stuyk/ezmongodb';

/**
 * A catch all handler for vehicle ownership.
 *
 * This checks if a player is the true owner of a vehicle.
 *
 * Options can be specified to check if a passenger has keys and so on and so forth.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
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
        includeGroupPermissions?: boolean;
        preventWhileAttached?: boolean;
    } = {},
): boolean {
    if (Overrides.isOwner) {
        return Overrides.isOwner(player, vehicle, options);
    }

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
        console.log('has perm I guess');
        return true;
    }

    if (options.includeKeys && Athena.vehicle.ownership.hasKeys(player, vehicle)) {
        return true;
    }

    if (options.includeGroupPermissions && Athena.vehicle.ownership.hasGroupPermission(player, vehicle)) {
        return true;
    }

    return data.owner === playerData._id;
}

/**
 * Checks if a player's character has a matching permission for a vehicle.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {boolean}
 */
export function hasPermission(player: alt.Player, vehicle: alt.Vehicle): boolean {
    if (Overrides.hasPermission) {
        return Overrides.hasPermission(player, vehicle);
    }

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
 * It's checking if the player has a group permission for the vehicle.
 *
 * If both the player and the vehicle are in the same group and have at least one matching perm, vehicle access is allowed.
 *
 * @name hasGroupPermission
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @returns {boolean}
 * @exports
 */
export function hasGroupPermission(player: alt.Player, vehicle: alt.Vehicle): boolean {
    if (Overrides.hasGroupPermission) {
        return Overrides.hasGroupPermission(player, vehicle);
    }

    if (Athena.vehicle.tempVehicles.has(vehicle)) {
        return false;
    }

    const playerData = Athena.document.character.get(player);
    if (typeof playerData === 'undefined') {
        return false;
    }

    if (typeof playerData.groups === 'undefined') {
        return false;
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.groups === 'undefined') {
        return false;
    }

    const vehicleGroupNames = Object.keys(data.groups);
    for (let groupName of vehicleGroupNames) {
        if (!playerData.groups[groupName]) {
            continue;
        }

        const intersections = [
            ...new Set(playerData.groups[groupName].filter((element) => data.groups[groupName].includes(element))),
        ];

        if (intersections.length <= 0) {
            continue;
        }

        return true;
    }

    return false;
}

/**
 * Checks if a player's character has a matching permission for a vehicle.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {boolean}
 */
export function hasKeys(player: alt.Player, vehicle: alt.Vehicle): boolean {
    if (Overrides.hasKeys) {
        return Overrides.hasKeys(player, vehicle);
    }

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
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(string | undefined)}
 */
export function get(vehicle: alt.Vehicle): string | undefined {
    if (Overrides.get) {
        return Overrides.get(vehicle);
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return undefined;
    }

    return data.owner;
}

/**
 * Return the owner of a vehicle based on player
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(alt.Player | undefined)}
 */
export function getAsPlayer(vehicle: alt.Vehicle): alt.Player | undefined {
    if (Overrides.getAsPlayer) {
        return Overrides.getAsPlayer(vehicle);
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return undefined;
    }

    return Athena.getters.player.byDatabaseID(data.owner);
}

/**
 * Add a character to the owned vehicle
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {alt.Player} player An alt:V Player Entity
 * @returns {Promise<boolean>}
 */
export async function addCharacter(vehicle: alt.Vehicle, player: alt.Player): Promise<boolean>;
/**
 * Add a character to the owned vehicle
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function addCharacter(vehicle: alt.Vehicle, id: string): Promise<boolean>;
/**
 * Add a character or player to the owned vehicle
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {(alt.Player | string)} playerOrId
 * @returns {Promise<boolean>}
 */
export async function addCharacter(vehicle: alt.Vehicle, playerOrId: alt.Player | string): Promise<boolean> {
    if (Overrides.addCharacter) {
        if (playerOrId instanceof alt.Player) {
            return await Overrides.addCharacter(vehicle, playerOrId);
        }

        return await Overrides.addCharacter(vehicle, playerOrId);
    }

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
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {(alt.Player | string)} playerOrId
 * @returns {Promise<boolean>}
 */
export async function removeCharacter(vehicle: alt.Vehicle, _id: string): Promise<boolean> {
    if (Overrides.removeCharacter) {
        return Overrides.removeCharacter(vehicle, _id);
    }

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

/**
 * Transfer ownership of a vehicle.
 *
 * Assign a vehicle to a specific character id.
 *
 * Automatically wipes keys on transfer.
 *
 * Returns true if successfully transferred.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {string} _id
 * @return {void}
 */
export async function transfer(vehicle: alt.Vehicle, _id: string): Promise<boolean> {
    if (Overrides.transfer) {
        return Overrides.transfer(vehicle, _id);
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    data.owner = _id;
    data.keys = [];
    return await Database.updatePartialData(
        data._id.toString(),
        { owner: data.owner, keys: data.keys },
        Athena.database.collections.Vehicles,
    );
}

interface VehicleOwnershipFuncs {
    isOwner: typeof isOwner;
    hasPermission: typeof hasPermission;
    hasGroupPermission: typeof hasGroupPermission;
    hasKeys: typeof hasKeys;
    get: typeof get;
    getAsPlayer: typeof getAsPlayer;
    addCharacter: typeof addCharacter;
    removeCharacter: typeof removeCharacter;
    transfer: typeof transfer;
}

const Overrides: Partial<VehicleOwnershipFuncs> = {};

export function override(functionName: 'isOwner', callback: typeof isOwner);
export function override(functionName: 'hasPermission', callback: typeof hasPermission);
export function override(functionName: 'hasKeys', callback: typeof hasKeys);
export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'getAsPlayer', callback: typeof getAsPlayer);
export function override(functionName: 'addCharacter', callback: typeof addCharacter);
export function override(functionName: 'removeCharacter', callback: typeof removeCharacter);
export function override(functionName: 'transfer', callback: typeof transfer);
/**
 * Used to override vehicle ownership functionality
 *
 *
 * @param {keyof VehicleOwnershipFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleOwnershipFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
