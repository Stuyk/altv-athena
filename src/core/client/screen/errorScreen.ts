import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import IErrorScreen from '@AthenaShared/interfaces/iErrorScreen.js';

let interval: number;
let timeout: number;

/**
 * Clear the currently drawn error screen.
 *
 *
 */
export function clear() {
    if (timeout) {
        alt.clearTimeout(timeout);
        timeout = null;
    }

    if (interval) {
        alt.clearInterval(interval);
        interval = null;
    }
}

/**
 * Create an error screen that takes up the whole screen.
 *
 * @param {IErrorScreen} screen
 *
 */
export function create(screen: IErrorScreen) {
    clear();

    alt.addGxtText('warning_error', screen.title);
    alt.addGxtText('warning_text', screen.text);

    if (screen.text2) {
        alt.addGxtText('warning_text2', screen.text2);
    }

    interval = alt.setInterval(() => {
        if (alt.isConsoleOpen()) {
            return;
        }

        native.setWarningMessageWithHeader(
            'warning_error',
            'warning_text',
            0,
            'warning_text2',
            false,
            -1,
            null,
            null,
            true,
            Number(1),
        );
    }, 0);

    if (screen.duration >= 0) {
        alt.setTimeout(clear, screen.duration);
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN, create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN_CLEAR, clear);
