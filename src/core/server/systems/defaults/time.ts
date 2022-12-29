import { eventsConst } from '@AthenaServer/api/consts/constEvents';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import * as alt from 'alt-server';

const TIME_BETWEEN_UPDATES = 30000; // 30 Seconds
let enabled = true;
let interval: number;
let minute;
let hour;

/**
 * Updates the player time to match the current server time.
 *
 * @param {alt.Player} player
 */
function updatePlayer(player: alt.Player) {
    if (!enabled) {
        return;
    }

    if (hour === undefined) {
        const time = new Date(Date.now());
        minute = time.getMinutes();
        hour = time.getHours();
    }

    player.setDateTime(1, 1, 2023, hour, minute, 0);
}

/**
 * Simple global weather system. Rotates through an array periodically.
 * Synchronizes it with all players.
 */
function handleWeatherUpdate() {
    if (!enabled) {
        return;
    }

    const time = new Date(Date.now());
    minute = time.getMinutes();
    hour = time.getHours();

    const loggedInPlayers = [...alt.Player.all].filter((x) => x && x.data && x.valid);
    if (loggedInPlayers.length <= 0) {
        return;
    }

    for (let player of loggedInPlayers) {
        updatePlayer(player);
    }
}

export const DefaultTimeSystem = {
    disable: () => {
        enabled = false;

        if (typeof interval !== 'undefined') {
            alt.clearInterval(interval);
            interval = undefined;
        }

        alt.log(`Default Time System Turned Off`);
    },
    getHour() {
        return hour;
    },
    getMinute() {
        return minute;
    },
    updatePlayer,
};

eventsConst.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, updatePlayer);
alt.setInterval(handleWeatherUpdate, TIME_BETWEEN_UPDATES);
