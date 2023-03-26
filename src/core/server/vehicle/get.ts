import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

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
 * const vehicles = Athena.vehicle.get.ownedVehicles();
 * ```
 *
 *
 * @return {Array<alt.Vehicle>} An array of owned vehicles.
 */
export function ownedVehicles(): Array<alt.Vehicle> {
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
 *     const vehicles = Athena.vehicle.get.playerOwnedVehicles(player);
 * }
 * ```
 *
 *
 * @param {(alt.Player | string)} player
 * @return {Array<alt.Vehicle>} An array of vehicles owned and spawned by a player.
 */
export function playerOwnedVehicles(player: alt.Player | string) {
    const _id = typeof player === 'string' ? player : Athena.document.character.getField(player, '_id');

    return alt.Vehicle.all.filter((vehicle) => {
        if (Athena.vehicle.tempVehicles.has(vehicle)) {
            return false;
        }

        const data = Athena.document.vehicle.get(vehicle);
        if (typeof data === 'undefined') {
            return false;
        }

        return data._id === _id;
    });
}
