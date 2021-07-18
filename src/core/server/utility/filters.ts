import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { distance } from '../../shared/utility/vector';

/**
 * Returns an array of players filtered by permission level.
 * @export
 * @param {Array<Permissions>} permissionLevels An array of 'Permissions.x' levels.
 * @return {Array<alt.Player>}
 */
export function getPlayersByPermissionLevel(permissionLevels: Array<Permissions>): Array<alt.Player> {
    const validPlayers = [...alt.Player.all].filter(
        (p) => p && p.data && p.accountData && permissionLevels.includes(p.accountData.permissionLevel)
    );

    return validPlayers;
}

/**
 * Returns an array of players filtered by grid space. (performant)
 * @export
 * @param {alt.Player} player
 * @param {number} maxDistance
 * @return {*}  {Array<alt.Player>}
 */
export function getPlayersByGridSpace(player: alt.Player, maxDistance: number): Array<alt.Player> {
    const currentPlayers = [...alt.Player.all];
    return currentPlayers.filter(
        (p) => p && p.valid && p.data && player.gridSpace === p.gridSpace && distance(player.pos, p.pos) < maxDistance
    );
}

/**
 * Returns the closest player in our grid space.
 * @export
 * @param {alt.Player} player
 * @return {alt.Player}  {alt.Player}
 */
export function getClosestPlayer(player: alt.Player): alt.Player {
    const players = [...alt.Player.all];
    let targetPlayer = players[0] !== player ? players[0] : players[1];
    let dist = distance(player.pos, targetPlayer.pos);

    for (let i = 0; i < players.length; i++) {
        const newDistance = distance(player.pos, players[i].pos);
        if (!players[i] || !players[i].data) {
            continue;
        }

        if (players[i] === player) {
            continue;
        }

        // This line is going to assist with finding a player in the same grid space.
        if (players[i].gridSpace !== player.gridSpace) {
            continue;
        }

        if (dist > newDistance) {
            continue;
        }

        dist = newDistance;
        targetPlayer = players[i];
    }

    return targetPlayer;
}
