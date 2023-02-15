import * as alt from 'alt-client';

import { isAnyMenuOpen } from '@AthenaClient/utility/menus';
import * as native from 'natives';

interface KeyBindRestrictions {
    /**
     * Player must be out of a vehicle to use this key bind.
     *
     * @type {boolean}
     */
    isOnFoot?: boolean;

    /**
     * Player must be in any vehicle to use this key bind.
     * Accessible by anyone in the vehicle.
     *
     * @type {boolean}
     */
    isVehicle?: boolean;

    /**
     * Player must be in a vehicle as a passenger. Not the driver.
     *
     * @type {boolean}
     */
    isVehiclePassenger?: boolean;

    /**
     * Player must be the driver of the vehicle.
     *
     * @type {boolean}
     */
    isVehicleDriver?: boolean;

    /**
     * Player must be aiming a weapon of some sort to trigger this key bind.
     *
     * @type {boolean}
     * @memberof KeyBindRestrictions
     */
    isAiming?: boolean;

    /**
     * Player must be swimming to be able to trigger this key bind.
     *
     * @type {boolean}
     * @memberof KeyBindRestrictions
     */
    isSwimming?: boolean;

    /**
     * Create an array of vehicle model hashes that this key bind only works under.
     * Example: `[alt.hash('infernus'), alt.hash('police2')]`
     *
     * @type {(Array<number>)}
     */
    vehicleModels?: Array<number>;

    /**
     * Create an array of weapon model hashes that this key bind only works under.
     * Example: `[alt.hash('w_ar_advancedrifle')]`
     *
     * @type {Array<number>}
     * @memberof KeyBindRestrictions
     */
    weaponModels?: Array<number>;
}

interface KeyInfo {
    /**
     * The primary key for this keybind.
     *
     * @type {number}
     * @memberof KeyInfo
     */
    key: number;

    /**
     * Give a keybind an identifier, like a unique id.
     *
     * @type {string}
     * @memberof KeyInfo
     */
    identifier: string;

    /**
     * Call this function when the key is pressed down once.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    keyDown?: Function;

    /**
     * Only triggered when `msToTrigger` is also specified for this key bind.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    delayedKeyDown?: {
        /**
         * Function to call after the criteria is met.
         *
         * @type {Function}
         */
        callback: Function;

        /**
         * Milliseconds needed to trigger this keybind.
         * Used for triggering if the key is held long enough.
         * The trigger is fired instantly after the time point is exceeded.
         *
         * @type {number}
         * @memberof KeyInfo
         */
        msToTrigger?: number;
    };

    /**
     * Call this function when the key is let go.
     * This function is only called when a key is released.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    keyUp?: Function;

    /**
     * Call this function on repeat while this key is held down.
     * Equivalent to an everyTick.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    whilePressed?: Function;

    /**
     * Specify a modifier for this key to trigger
     *
     * @type {('shift' | 'ctrl' | 'alt')}
     * @memberof KeyInfo
     */
    modifier?: 'shift' | 'ctrl' | 'alt';

    /**
     * If set to true, any page / menu will allow triggering this keybind.
     *
     * @type {boolean}
     * @memberof KeyInfo
     */
    allowInAnyMenu?: true;

    /**
     * Set a key as disabled, preventing all function callbacks.
     *
     * @type {boolean}
     * @memberof KeyInfo
     */
    disabled?: boolean;

    /**
     * Restrictions to apply to this key bind.
     * These are all optional. By default key binds work regardless of setting these values.
     */
    restrictions?: KeyBindRestrictions;
}

const keyMappings: Array<KeyInfo> = [];
const keyDownTime: { [identifier: string]: number } = {};
const keyModifier = {
    shift: {
        key: 16,
        pressed: false,
    },
    ctrl: {
        key: 17,
        pressed: false,
    },
    alt: {
        key: 18,
        pressed: false,
    },
};

const Internal = {
    init() {
        alt.on('keydown', Internal.keyDown);
        alt.on('keyup', Internal.keyUp);
        alt.everyTick(Internal.keyHeld);
    },
    isValidRestrictions(data: KeyBindRestrictions): boolean {
        if (typeof data === 'undefined') {
            return true;
        }

        if (data.isAiming && !alt.Player.local.isAiming) {
            return false;
        }

        if (data.isOnFoot && alt.Player.local.vehicle) {
            return false;
        }

        // Vehicle Checks
        if (data.isVehicle || data.isVehicle || data.isVehicleDriver || data.vehicleModels) {
            if (!alt.Player.local.vehicle) {
                return false;
            }

            if (data.isVehicleDriver && alt.Player.local.seat !== 1) {
                return false;
            }

            if (data.isVehiclePassenger && alt.Player.local.seat === 1) {
                return false;
            }

            if (data.vehicleModels && !data.vehicleModels.find((x) => x === alt.Player.local.vehicle.model)) {
                return false;
            }
        }

        if (data.isSwimming && !native.isPedSwimming(alt.Player.local.scriptID)) {
            return false;
        }

        if (data.weaponModels && !data.weaponModels.find((x) => x === alt.Player.local.currentWeapon)) {
            return false;
        }

        return true;
    },
    setDisabled(key: number | string, value: boolean) {
        let index: number;
        if (typeof key === 'string') {
            index = keyMappings.findIndex((x) => x && x.identifier === key);
        } else {
            index = keyMappings.findIndex((x) => x.key === key);
        }

        if (index <= -1) {
            return;
        }

        keyMappings[index].disabled = value;
    },
    getKeyInfo(key: number | string): KeyInfo | undefined {
        if (typeof key === 'string') {
            return keyMappings.find((x) => x && x.identifier === key);
        }

        return keyMappings.find((x) => x.key === key);
    },
    keyDown(key: number) {
        const keyInfo = Internal.getKeyInfo(key);

        if (!keyInfo) {
            return;
        }

        if (keyInfo.disabled) {
            return;
        }

        if (!keyInfo.allowInAnyMenu && isAnyMenuOpen()) {
            return;
        }

        if (keyInfo.modifier && keyModifier[keyInfo.modifier] && !keyModifier[keyInfo.modifier].pressed) {
            return;
        }

        if (keyInfo.delayedKeyDown && keyInfo.delayedKeyDown.msToTrigger >= 1) {
            keyDownTime[keyInfo.identifier] = Date.now() + keyInfo.delayedKeyDown.msToTrigger;
        }

        if (!keyInfo.keyDown) {
            return;
        }

        keyInfo.keyDown();
    },
    keyUp(key: number) {
        const keyInfo = Internal.getKeyInfo(key);
        if (!keyInfo) {
            return;
        }

        delete keyDownTime[keyInfo.identifier];

        if (keyInfo.disabled) {
            return;
        }

        if (!keyInfo.allowInAnyMenu && isAnyMenuOpen()) {
            return;
        }

        if (keyInfo.modifier && keyModifier[keyInfo.modifier] && !keyModifier[keyInfo.modifier].pressed) {
            return;
        }

        if (!keyInfo.keyUp) {
            return;
        }

        keyInfo.keyUp();
    },
    keyHeld() {
        // Check Modifier Keys First
        Object.keys(keyModifier).forEach((keyName) => {
            if (alt.isKeyDown(keyModifier[keyName].key)) {
                keyModifier[keyName].pressed = true;
            } else {
                keyModifier[keyName].pressed = false;
            }
        });

        // Check matching keys in keyDownTime
        Object.keys(keyDownTime).forEach((identifier) => {
            const timeToExceed = keyDownTime[identifier];
            if (Date.now() < timeToExceed) {
                return;
            }

            delete keyDownTime[identifier];
            const keyInfo = Internal.getKeyInfo(identifier);
            if (!keyInfo.delayedKeyDown) {
                return;
            }

            keyInfo.delayedKeyDown.callback();
        });

        // Check for whilePressed functions, and execute
        for (let keyInfo of keyMappings) {
            if (!keyInfo.whilePressed) {
                continue;
            }

            if (keyInfo.disabled) {
                continue;
            }

            if (!alt.isKeyDown(keyInfo.key)) {
                continue;
            }

            keyInfo.whilePressed();
        }
    },
};

export const HotkeyRegistry = {
    /**
     * Add a key bind to the start listening for key presses.
     * https://www.toptal.com/developers/keycode
     *
     * @param {KeyInfo} keyBind
     */
    add(keyBind: KeyInfo) {
        keyMappings.push(keyBind);
    },
    /**
     * Used to check if a keybind passes certain validation metrics.
     * Useful for show on-screen data related to a key bind.
     * Should only be called periodically. Roughly every 500ms~1s
     *
     * @param {(string | number)} keyOrIdentifier
     */
    checkValidation(keyOrIdentifier: string | number): boolean {
        const keyInfo = Internal.getKeyInfo(keyOrIdentifier);
        if (typeof keyInfo === 'undefined') {
            return false;
        }

        return Internal.isValidRestrictions(keyInfo.restrictions);
    },
    set: {
        /**
         * Disble a keybind
         *
         * @param {(string | number)} keyOrIdentifier
         */
        disabled(keyOrIdentifier: string | number) {
            Internal.setDisabled(keyOrIdentifier, true);
        },
        /**
         * Enable a keybind
         *
         * @param {(string | number)} keyOrIdentifier
         */
        enabled(keyOrIdentifier: string | number) {
            Internal.setDisabled(keyOrIdentifier, false);
        },
    },
};

Internal.init();
