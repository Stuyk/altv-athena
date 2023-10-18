import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned.js';
import Database from '@stuyk/ezmongodb';

/**
 * Used the internal alt:V Identifiers to find a vehicle.
 *
 * These IDs always change, and are never the same.
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function spawnedVehicleByEntityID(id: number) {
    return alt.Vehicle.all.find((x) => x.id === id);
}

/**
 * Returns a spawned vehicle by their database identifier.
 *
 * Not to be confused with `_id`.
 *
 * @export
 * @param {(string | number)} id
 * @return {(alt.Vehicle | undefined)}
 */
export function spawnedVehicleByDatabaseID(id: string | number): alt.Vehicle | undefined {
    if (typeof id === 'string') {
        const parsedNumber = parseInt(id);
        if (isNaN(parsedNumber)) {
            return undefined;
        }

        id = parsedNumber;
    }

    const vehicle = alt.Vehicle.all.find((veh) => {
        const data = Athena.document.vehicle.get(veh);
        if (typeof data === 'undefined') {
            return false;
        }

        if (data.id !== id) {
            return false;
        }

        return true;
    });

    return vehicle;
}

/**
 * Returns a spawned vehicle by their unique database `_id`.
 *
 * @export
 * @param {string} _id
 * @return {(alt.Vehicle | undefined)}
 */
export function spawnedVehicleByDocumentID(_id: string): alt.Vehicle | undefined {
    const vehicle = alt.Vehicle.all.find((veh) => {
        const data = Athena.document.vehicle.get(veh);
        if (typeof data === 'undefined') {
            return false;
        }

        if (data._id !== _id) {
            return false;
        }

        return true;
    });

    return vehicle;
}

/**
 * Returns an owned vehicle by Document ID.
 *
 * @export
 * @param {string} _id
 * @return {Promise<OwnedVehicle>}
 */
export async function ownedVehicleByDocumentID(_id: string): Promise<OwnedVehicle> {
    return await Database.fetchData<OwnedVehicle>('_id', _id, Athena.database.collections.Vehicles);
}

/**
 * Returns an owned vehicle by Database ID.
 *
 * @export
 * @param {string} _id
 * @return {Promise<OwnedVehicle>}
 */
export async function ownedVehicleByDatabaseID(id: string | number): Promise<OwnedVehicle> {
    if (typeof id === 'string') {
        const parsedNumber = parseInt(id);
        if (isNaN(parsedNumber)) {
            return undefined;
        }

        id = parsedNumber;
    }

    return await Database.fetchData<OwnedVehicle>('id', id, Athena.database.collections.Vehicles);
}

/**
 * Get all temporary vehicles.
 *
 * #### Example
 * ```ts
 * const vehicles = Athena.vehicle.get.temporaryVehicles();
 * ```
 *
 *
 * @return {Array<alt.Vehicle>} An array of temporary vehicles.
 */
export function temporaryVehicles(): Array<alt.Vehicle> {
    return alt.Vehicle.all.filter((vehicle) => {
        return Athena.vehicle.tempVehicles.has(vehicle);
    });
}

/**
 * Get all owned vehicles.
 *
 * #### Example
 * ```ts
 * const vehicles = Athena.vehicle.get.vehiclesWithOwnership();
 * ```
 *
 *
 * @return {Array<alt.Vehicle>} An array of owned vehicles.
 */
export function vehiclesWithOwnership(): Array<alt.Vehicle> {
    return alt.Vehicle.all.filter((vehicle) => {
        return Athena.vehicle.tempVehicles.has(vehicle) === false;
    });
}

/**
 * Takes a player instance, or `_id` and returns all spawned & owned vehicles
 *
 * #### Example
 * ```ts
 * function something(player: alt.Player) {
 *     const vehicles = Athena.vehicle.get.vehiclesSpawnedByPlayer(player);
 * }
 * ```
 *
 *
 * @param {(alt.Player | string)} player
 * @return {Array<alt.Vehicle>} An array of vehicles owned and spawned by a player.
 */
export function vehiclesSpawnedByPlayer(playerOrDocumentID: alt.Player | string) {
    if (playerOrDocumentID instanceof alt.Player) {
        playerOrDocumentID = Athena.document.character.getField(playerOrDocumentID, '_id');
        if (typeof playerOrDocumentID === 'undefined') {
            return [];
        }
    }

    return alt.Vehicle.all.filter((vehicle) => {
        if (Athena.vehicle.tempVehicles.has(vehicle)) {
            return false;
        }

        const data = Athena.document.vehicle.get(vehicle);
        if (typeof data === 'undefined') {
            return false;
        }

        return data.owner === playerOrDocumentID;
    });
}

/**
 * Returns a list of vehicle documents owned by the player.
 *
 * @export
 * @param {(alt.Player | string)} playerOrDocumentID
 */
export async function ownedVehiclesByPlayer<T = OwnedVehicle>(
    playerOrDocumentID: alt.Player | string,
): Promise<Array<T>> {
    if (playerOrDocumentID instanceof alt.Player) {
        playerOrDocumentID = Athena.document.character.getField(playerOrDocumentID, '_id');
        if (typeof playerOrDocumentID === 'undefined') {
            return [];
        }
    }

    return await Database.fetchAllByField<T>('owner', playerOrDocumentID, Athena.database.collections.Vehicles);
}
