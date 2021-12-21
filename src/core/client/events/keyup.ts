import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/system';

const KEY_UP_BINDS: Keybinds = {};
const DELAY_BETWEEN_LONG_PRESSES = 800;
const DELAY_BETWEEN_PRESSES = 500;

let keyPressTimes = {};
let nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

interface Keybinds {
    [key: number]: Keybind;
}

interface Keybind {
    key?: number;
    singlePress: (...args: any[]) => void; // Callback Function
    longPress?: (...args: any[]) => void; // Callback Function
}

export class KeybindController {
    /**
     * Used to register a Keybind to a callback function.
     * @static
     * @param {Keybind} keybind
     * @memberof KeybindController
     */
    static registerKeybind(keybind: Keybind) {
        if (keybind.key === null || keybind.key === undefined) {
            throw new Error(`Keybind key number was not specified.`);
        }

        if (KEY_UP_BINDS[keybind.key]) {
            throw new Error(`${keybind.key} is already a registered keybind.`);
        }

        KEY_UP_BINDS[keybind.key] = keybind;
    }

    /**
     * Called when the player lets go a key.
     * @static
     * @param {number} key
     * @return {*}
     * @memberof KeybindController
     */
    static keyUp(key: number) {
        if (!KEY_UP_BINDS[key]) {
            return;
        }

        // Athena Menus
        if (alt.Player.local.isMenuOpen) {
            return;
        }

        // Console Menu
        if (alt.isMenuOpen()) {
            return;
        }

        if (Date.now() < nextKeyPress) {
            return;
        }

        nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

        if (keyPressTimes[key] === null) {
            return;
        }

        keyPressTimes[key] = null;

        // Long Press
        const isLongPressReady = keyPressTimes[key] + DELAY_BETWEEN_LONG_PRESSES < Date.now();
        if (keyPressTimes[key] && isLongPressReady && KEY_UP_BINDS[key]['longPress']) {
            KEY_UP_BINDS[key].longPress(key);
        }

        // Single Press
        if (KEY_UP_BINDS[key] && KEY_UP_BINDS[key].singlePress) {
            KEY_UP_BINDS[key].singlePress(key);
        }
    }

    /**
     * Called when the player presses down a key.
     * @static
     * @param {number} key
     * @return {*}
     * @memberof KeybindController
     */
    static keyDown(key: number) {
        // Athena Menus
        if (alt.Player.local.isMenuOpen) {
            return;
        }

        // Console Menu
        if (alt.isMenuOpen()) {
            return;
        }

        keyPressTimes[key] = Date.now();

        if (!KEY_UP_BINDS[key]) {
            return;
        }

        if (!KEY_UP_BINDS[key]['longPress']) {
            return;
        }

        alt.setTimeout(() => {
            if (!keyPressTimes[key]) {
                return;
            }

            keyPressTimes[key] = null;

            if (KEY_UP_BINDS[key]['longPress']) {
                KEY_UP_BINDS[key]['longPress'](key);
            }
        }, DELAY_BETWEEN_LONG_PRESSES);
    }

    /**
     * Start listening for keybinds.
     * @static
     * @memberof KeybindController
     */
    static start() {
        alt.on('keyup', KeybindController.keyUp);
        alt.on('keydown', KeybindController.keyDown);
    }

    /**
     * Stop listening for keybinds.
     * @static
     * @memberof KeybindController
     */
    static stop() {
        alt.off('keyup', KeybindController.keyUp);
        alt.off('keydown', KeybindController.keyDown);
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, KeybindController.start);
