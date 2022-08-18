import * as alt from 'alt-server';
import { IVector3 } from 'alt-shared';
import { getClosestOfType } from '../../shared/utility/closest';

/**
 * Gets the closest vehicle to a position.
 *
 * @export
 * @param {IVector3} pos
 * @return {(alt.Vehicle | undefined)}
 */
export function getClosestVehicle(pos: IVector3): alt.Vehicle | undefined {
    const vehicles = alt.Vehicle.all.filter((p) => p && p.valid);
    return getClosestOfType<alt.Vehicle>(pos, vehicles);
}

/**
 * Gets the closest player to a position.
 *
 * @export
 * @param {IVector3} pos
 * @return {(alt.Player | undefined)}
 */
export function getClosestPlayer(pos: IVector3): alt.Player | undefined {
    const players = alt.Player.all.filter((p) => p && p.valid && p.hasFullySpawned);
    return getClosestOfType<alt.Player>(pos, players);
}

