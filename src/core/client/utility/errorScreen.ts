import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import IErrorScreen from '../../shared/interfaces/iErrorScreen';

let interval: number;
let timeout: number;

export default class ErrorScreen {
    /**
     * Create an error screen that takes up the whole screen.
     * @static
     * @param {IErrorScreen} screen
     * @memberof ErrorScreen
     */
    static create(screen: IErrorScreen) {
        ErrorScreen.clear();

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
                0,
                0,
                true,
                0,
            );
        }, 0);

        if (screen.duration >= 0) {
            alt.setTimeout(ErrorScreen.clear, screen.duration);
        }
    }

    /**
     * Clear the currently drawn error screen.
     * @static
     * @memberof ErrorScreen
     */
    static clear() {
        if (timeout) {
            alt.clearTimeout(timeout);
            timeout = null;
        }

        if (interval) {
            alt.clearInterval(interval);
            interval = null;
        }
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN, ErrorScreen.create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ERROR_SCREEN_CLEAR, ErrorScreen.clear);
