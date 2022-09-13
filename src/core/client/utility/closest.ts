import * as alt from 'alt-client';
import { IVector3 } from 'alt-shared';

import { getClosestOfType } from '../../shared/utility/closest';

/**
 * A limited version of getting the closest vehicle.
 * It does not consider non-streamed vehicles.
 *
 * If a vehicle is out of the stream range it is unconsidered.
 *
 * @export
 * @param {IVector3} pos
 * @return {(alt.Vehicle | undefined)}
 */
export function getClosestVehicle(pos: IVector3): alt.Vehicle | undefined {
    const vehicles = alt.Vehicle.all.filter((p) => p && p.valid && p.pos.x !== 0 && p.pos.y !== 0 && p.pos.z !== 0);
    return getClosestOfType<alt.Vehicle>(pos, vehicles);
}

/**
 * A limited version of getting the closest player.
 * It does not consider non-streamed players.
 *
 * If a player is out of the stream range it is unconsidered.
 *
 * @export
 * @param {IVector3} pos
 * @return {(alt.Player | undefined)}
 */
export function getClosestPlayer(pos: IVector3): alt.Player | undefined {
    const players = alt.Player.all.filter((p) => p && p.valid && p.pos.x !== 0 && p.pos.y !== 0 && p.pos.z !== 0);
    return getClosestOfType<alt.Player>(pos, players);
}
