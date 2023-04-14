import * as alt from 'alt-server';

const cooldowns: { [id: string]: number } = {};

/**
 * Register a cooldown, with predetermiend
 *
 * @export
 * @param {alt.Player} player
 */
export function updateCooldown(player: alt.Player) {
    cooldowns[player.id] = Date.now() + 2000;
}

/**
 * Check if a cooldown is completed.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function isCooldownDone(player: alt.Player) {
    if (!cooldowns[player.id]) {
        return true;
    }

    return Date.now() > cooldowns[player.id];
}

/**
 * Clear cooldown for triggering the door event.
 *
 * @export
 * @param {alt.Player} player
 */
export function clearCooldown(player: alt.Player) {
    delete cooldowns[player.id];
}

/**
 * Get expiration time of a cooldown
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function getExpiration(player: alt.Player) {
    if (!cooldowns[player.id]) {
        return Date.now();
    }

    return cooldowns[player.id];
}

alt.on('playerDisconnect', clearCooldown);
