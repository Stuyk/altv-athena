import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const TIME_BETWEEN_UPDATES = 30000; // 30 Seconds
let enabled = true;
let interval: number;
let minute;
let hour;

const Internal = {
    /**
     * Simple global weather system. Rotates through an array periodically.
     * Synchronizes it with all players.
     */
    handleWeatherUpdate() {
        if (!enabled) {
            return;
        }

        const time = new Date(Date.now());
        minute = time.getMinutes();
        hour = time.getHours();

        const loggedInPlayers = Athena.getters.players.online();
        if (loggedInPlayers.length <= 0) {
            return;
        }

        for (let player of loggedInPlayers) {
            updatePlayer(player);
        }
    },
    init() {
        if (!enabled) {
            return;
        }

        Athena.player.events.on('selected-character', updatePlayer);
        alt.setInterval(Internal.handleWeatherUpdate, TIME_BETWEEN_UPDATES);
        alt.log(`~lc~Default System: ~g~Time`);
    },
};

/**
 * Updates the player time to match the current server time.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function updatePlayer(player: alt.Player) {
    if (!enabled) {
        return;
    }

    if (hour === undefined) {
        const time = new Date(Date.now());
        minute = time.getMinutes();
        hour = time.getHours();
    }

    player.setDateTime(1, 1, 2023, hour, minute, 0);
    player.emit(SYSTEM_EVENTS.SET_GAME_TIME, hour, minute);
}

/**
 * Disable the default time synchronization on server-side.
 *
 * #### Example
 * ```ts
 * Athena.systems.default.time.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;

    if (typeof interval !== 'undefined') {
        alt.clearInterval(interval);
        interval = undefined;
    }

    alt.log(`Default Time System Turned Off`);
}

/**
 * Get the current hour.
 *
 *
 * @return {number}
 */
export function getHour(): number {
    return hour;
}

/**
 * Get the current minute.
 *
 *
 * @return {number}
 */
export function getMinute(): number {
    return minute;
}

Athena.systems.plugins.addCallback(Internal.init);
