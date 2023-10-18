import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

const SessionKey = 'athena-dd-loading-instance';

declare global {
    namespace AthenaSession {
        interface Player {
            [SessionKey]: boolean;
        }
    }
}

/**
 * Unregister a player that is loading.
 *
 * @param {alt.Player} player
 */
export function unregister(player: alt.Player) {
    Athena.session.player.clearKey(player, SessionKey);
}

/**
 * Register a player to start loading a door.
 *
 * @export
 * @param {alt.Player} player
 */
export function register(player: alt.Player) {
    Athena.session.player.set(player, SessionKey, true);
}

/**
 * Check if a player is loading a door currently.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function isLoading(player: alt.Player) {
    return Athena.session.player.has(player, SessionKey);
}
