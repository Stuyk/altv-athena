import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import ISpinner from '@AthenaShared/interfaces/iSpinner';

let timeout: number;

const Spinner = {
    /**
     * Create a spinner to show in the bottom-right corner.
     * @static
     * @param {ISpinner} spinner
     * @memberof Spinner
     */
    create(data: ISpinner) {
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
    },

    /**
     * Used to clear the last set spinner.
     * @static
     * @memberof Spinner
     */
    clear() {
        if (timeout) {
            alt.clearTimeout(timeout);
            timeout = null;
        }

        native.busyspinnerOff();
    },
};

export default Spinner;

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SPINNER, Spinner.create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SPINNER_CLEAR, Spinner.clear);
