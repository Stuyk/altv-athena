import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';

/**
 * Get all vehicles in range of a position
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {number} range
 * @return {alt.Vehicle[]}
 */
export function inRange(pos: alt.IVector3, range: number): alt.Vehicle[] {
    return alt.Vehicle.all.filter((x) => {
        if (!x.valid || !x.pos) {
            return false;
        }

        return Athena.utility.vector.distance(x.pos, pos) <= range;
    });
}

/**
 * Get all owned vehicles.
 *
 * @export
 * @template T
 */
export function asOwnedVehicles<T = OwnedVehicle>() {
    return Athena.document.vehicle.getAllOnline<T>();
}
