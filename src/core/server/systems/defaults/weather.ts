import * as alt from 'alt-server';
import { getWeatherFromString, WEATHER_KEY } from '@AthenaShared/utility/weather';
import * as Athena from '@AthenaServer/api';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const TIME_BETWEEN_UPDATES = 60000 * 5; // 5 Minutes
// const TIME_BETWEEN_UPDATES = 30000; // 30s FOR TESTING
let weathers: Array<WEATHER_KEY> = [
    'ExtraSunny',
    'ExtraSunny',
    'Clear',
    'Clouds',
    'Overcast',
    'Rain',
    'Thunder',
    'Rain',
    'Foggy',
    'Overcast',
    'Clearing',
];

let enabled = true;
let interval: number;

const Internal = {
    /**
     * Simple global weather system. Rotates through an array periodically.
     * Synchronizes it with all players.
     */
    handleWeatherUpdate() {
        if (!enabled) {
            return;
        }

        const loggedInPlayers = Athena.getters.players.online();
        if (loggedInPlayers.length <= 0) {
            return;
        }

        // Remove first weather item.
        // Push to the back of the array.
        weathers.push(weathers.shift());

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
        alt.log(`~lc~Default System: ~g~Weather`);
    },
};

/**
 * Updates the player weather to match current weather system.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function updatePlayer(player: alt.Player) {
    if (!enabled) {
        return;
    }

    // Athena.player.emit.message(player, `Weather is now ${weathers[0]}.`);
    Athena.player.emit.setWeather(player, weathers[0], 30);
}

/**
 * Disable the default weather from updating players.
 *
 * #### Example
 * ```ts
 * Athena.systems.default.weather.disable();
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

    alt.log(`Default Weather System Turned Off`);
}

/**
 * Used to override the default weather cycle.
 *
 *
 * @param {Array<WEATHER_KEY>} weathers
 */
export function setWeatherCycle(newWeatherCycle: Array<WEATHER_KEY>) {
    if (newWeatherCycle.length <= 1) {
        alt.logWarning(`Weather cycle must have at least 1 weather type`);
        return;
    }

    weathers = newWeatherCycle;
}

export function getCurrentWeather(asString: false): number;
export function getCurrentWeather(asString: true): string;
/**
 * Get the current weather as a string or number.
 *
 *
 * @param {boolean} [asString=false]
 * @return {(number | string)}
 */
export function getCurrentWeather(asString = false): number | string {
    return asString ? weathers[0] : getWeatherFromString(weathers[0]);
}

Athena.systems.plugins.addCallback(Internal.init);
