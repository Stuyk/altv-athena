import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import * as Athena from '@AthenaServer/api/index.js';
import * as alt from 'alt-server';

/**
 * Emit a notification to all players.
 *
 *
 * @param {string} message
 * @param {...any[]} args
 */
export function toAll(message: string, ...args: any[]) {
    const onlinePlayers = Athena.getters.players.online();
    if (onlinePlayers.length <= 0) {
        return;
    }

    alt.emitClient(onlinePlayers, SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message, ...args);
}

/**
 * Emit a notification to a single client.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} message
 * @param {...any[]} args
 */
export function toPlayer(player: alt.Player, message: string, ...args: any[]) {
    if (!player || !player.valid) {
        return;
    }

    player.emit(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message, ...args);
}
