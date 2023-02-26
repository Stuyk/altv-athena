import * as alt from 'alt-server';
import { has } from './tempVehicles';

/**
 * Get all temporary vehicles.
 *
 * @export
 * @return {Array<alt.Vehicle>}
 */
export function temporaryVehicles(): Array<alt.Vehicle> {
    return alt.Vehicle.all.filter((vehicle) => {
        return has(vehicle);
    });
}
