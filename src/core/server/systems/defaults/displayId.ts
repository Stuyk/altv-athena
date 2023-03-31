import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import * as alt from 'alt-server';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Player ID On Screen';
const point = {
    x: 0.99,
    y: 0.005,
};

let enabled = true;

const Internal = {
    async init() {
        if (!enabled) {
            return;
        }

        Athena.player.events.on('selected-character', Internal.handleSelect);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
    handleSelect(player: alt.Player) {
        player.emit(SYSTEM_EVENTS.SHOW_SCREEN_PLAYER_ID, point);
    },
};

/**
 * Disable default id display on-screen for players.
 *
 * #### Example
 * ```ts
 * Athena.systems.default.displayId.disable();
 * ```
 *
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

/**
 * Change the position of the on-screen id a player sees
 *
 * X as 1 = Right of Screen
 * Y as 1 = Bottom of Screen
 *
 * #### Example
 * ```ts
 * // Place in the very center of the screen. I'm sure everyone would love it.
 * Athena.systems.default.displayId.setLocation(0.5, 0.5);
 * ```
 *
 *
 * @param {number} x 0 - 1.0
 * @param {number} y 0 - 1.0
 * @return {void}
 */
export function setLocation(x: number, y: number) {
    if (x > 1 || x < 0) {
        alt.logWarning(`X value for display must be between 0 - 1.0`);
        return;
    }

    if (y > 1 || y < 0) {
        alt.logWarning(`Y value for display must be between 0 - 1.0`);
        return;
    }

    point.x = x;
    point.y = y;
}

Athena.systems.plugins.addCallback(Internal.init);
