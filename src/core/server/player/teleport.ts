import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

/**
 * Teleport first player to second player.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Player} target
 */
export function goto(player: alt.Player, target: alt.Player | string | number) {
    if (typeof target === 'string' || typeof target === 'number') {
        target = Athena.systems.identifier.getPlayer(target);
    }

    if (typeof target === 'undefined') {
        return;
    }

    if (!(target instanceof alt.Player)) {
        return;
    }

    player.pos = target.pos;
}

/**
 * Teleport second player to first player.
 *
 * @export
 * @param {alt.Player} player
 * @param {*} target
 * @return {*}
 */
export function toMe(player: alt.Player, target: alt.Player | string | number) {
    if (typeof target === 'string' || typeof target === 'number') {
        target = Athena.systems.identifier.getPlayer(target);
    }

    if (typeof target === 'undefined') {
        return;
    }

    if (!(target instanceof alt.Player)) {
        return;
    }

    target.pos = player.pos;
}

/**
 * Teleport many players to the a player.
 *
 * @export
 * @param {alt.Player} target
 * @param {(alt.Player[] | number[] | string[])} players
 */
export function manyPlayersToAnotherPlayer(target: alt.Player, players: alt.Player[] | number[] | string[]) {
    for (let somePlayer of players) {
        toMe(target, somePlayer);
    }
}

/**
 * Teleport a player to a vehicle.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 */
export function toVehicle(player: alt.Player, vehicle: alt.Vehicle) {
    if (!vehicle || !vehicle.valid) {
        return;
    }

    player.pos = vehicle.pos;
}

/**
 * Teleport a player to a position.
 *
 * @export
 * @param {alt.Player} player
 * @param {alt.IVector3} pos
 */
export function toPosition(player: alt.Player, pos: alt.IVector3) {
    Athena.player.safe.setPosition(player, pos.x, pos.y, pos.z, false);
}
