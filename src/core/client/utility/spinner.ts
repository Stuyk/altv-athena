import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import ISpinner from '../../shared/interfaces/iSpinner';

let timeout: number;

export default class Spinner {
    /**
     * Create a spinner to show in the bottom-right corner.
     * @static
     * @param {ISpinner} spinner
     * @memberof Spinner
     */
    static create(data: ISpinner) {
        Spinner.clear();

        if (!data.type) {
            data.type = 0;
        }

        native.beginTextCommandBusyspinnerOn('STRING');
        native.addTextComponentSubstringPlayerName(data.text);
        native.endTextCommandBusyspinnerOn(data.type);

        if (data.duration >= 0) {
            timeout = alt.setTimeout(Spinner.clear, data.duration);
        }
    }

    /**
     * Used to clear the last set spinner.
     * @static
     * @memberof Spinner
     */
    static clear() {
        if (timeout) {
            alt.clearTimeout(timeout);
            timeout = null;
        }

        native.busyspinnerOff();
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SPINNER, Spinner.create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SPINNER_CLEAR, Spinner.clear);
