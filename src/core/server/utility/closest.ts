import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

/**
 * Gets the closest vehicle to a position.
 *
 *
 * @param {alt.IVector3} pos A position in the world.
 * @return {(alt.Vehicle | undefined)}
 */
export function getClosestVehicle(pos: alt.IVector3): alt.Vehicle | undefined {
    const vehicles = [...alt.Vehicle.all].filter((p) => p && p.valid);
    return Athena.utility.vector.getClosestOfType<alt.Vehicle>(pos, vehicles);
}

/**
 * Gets the closest player to a position.
 *
 *
 * @param {alt.IVector3} pos A position in the world.
 * @return {(alt.Player | undefined)}
 */
export function getClosestPlayer(pos: alt.IVector3, ignoredIds: Array<number> = []): alt.Player | undefined {
    const players = [...alt.Player.all].filter((player) => {
        if (!player || !player.valid) {
            return false;
        }

        if (typeof Athena.document.character.get(player) === 'undefined') {
            return false;
        }

        if (typeof ignoredIds.find((x) => x === player.id) !== 'undefined') {
            return false;
        }

        return true;
    });

    return Athena.utility.vector.getClosestOfType<alt.Player>(pos, players);
}

export default { getClosestPlayer, getClosestVehicle };
