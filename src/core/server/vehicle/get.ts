import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

/**
 * Get all temporary vehicles.
 *
 * @example
 * ```ts
 * const vehicles = Athena.vehicle.get.temporaryVehicles();
 * ```
 *
 * @export
 * @return {Array<alt.Vehicle>}
 */
export function temporaryVehicles(): Array<alt.Vehicle> {
    return alt.Vehicle.all.filter((vehicle) => {
        return Athena.vehicle.tempVehicles.has(vehicle);
    });
}

/**
 * Get all owned vehicles.
 *
 * @example
 * ```ts
 * const vehicles = Athena.vehicle.get.ownedVehicles();
 * ```
 *
 * @export
 * @return {Array<alt.Vehicle>}
 */
export function ownedVehicles(): Array<alt.Vehicle> {
    return alt.Vehicle.all.filter((vehicle) => {
        return Athena.vehicle.tempVehicles.has(vehicle) === false;
    });
}

/**
 * Takes a player instance, or `_id` and returns all spawned & owned vehicles
 *
 * @example
 * ```ts
 * function something(player: alt.Player) {
 *     const vehicles = Athena.vehicle.get.playerOwnedVehicles(player);
 * }
 * ```
 *
 * @export
 * @param {(alt.Player | string)} player
 * @return {Array<alt.Vehicle>}
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
