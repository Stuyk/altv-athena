import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import ISpinner from '@AthenaShared/interfaces/iSpinner.js';

let timeout: number;

/**
 * Used to clear the last set spinner.
 *
 */
export function clear() {
    if (timeout) {
        alt.clearTimeout(timeout);
        timeout = null;
    }

    native.busyspinnerOff();
}

/**
 * Create a spinner to show in the bottom-right corner.
 *
 * @param {ISpinner} spinner
 */
export function create(data: ISpinner) {
    clear();

    if (!data.type) {
        data.type = 0;
    }

    native.beginTextCommandBusyspinnerOn('STRING');
    native.addTextComponentSubstringPlayerName(data.text);
    native.endTextCommandBusyspinnerOn(data.type);

    if (data.duration >= 0) {
        timeout = alt.setTimeout(clear, data.duration);
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SPINNER, create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SPINNER_CLEAR, clear);
