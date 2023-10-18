import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

const SessionKey = 'athena-dd-cooldown-instance';

declare global {
    namespace AthenaSession {
        interface Player {
            [SessionKey]: number;
        }
    }
}

/**
 * Register a cooldown, with predetermiend
 *
 * @export
 * @param {alt.Player} player
 */
export function updateCooldown(player: alt.Player) {
    Athena.session.player.set(player, SessionKey, Date.now() + 2000);
}

/**
 * Check if a cooldown is completed.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function isCooldownDone(player: alt.Player) {
    if (!Athena.session.player.has(player, SessionKey)) {
        return true;
    }

    return Date.now() > Athena.session.player.get(player, SessionKey);
}

/**
 * Clear cooldown for triggering the door event.
 *
 * @export
 * @param {alt.Player} player
 */
export function clearCooldown(player: alt.Player) {
    Athena.session.player.clearKey(player, SessionKey);
}

/**
 * Get expiration time of a cooldown
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function getExpiration(player: alt.Player) {
    if (!Athena.session.player.has(player, SessionKey)) {
        return Date.now();
    }

    return Athena.session.player.get(player, SessionKey);
}
