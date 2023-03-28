import * as alt from 'alt-client';
import * as native from 'natives';

import * as AthenaClient from '@AthenaClient/api';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { KeyBindRestrictions, KeyInfo } from '@AthenaClient/interface/hotkeys';

export type KeyInfoDefault = KeyInfo & { default: number };

const keyMappings: Array<KeyInfoDefault> = [];
const keyDownTime: { [identifier: string]: number } = {};
const keyCooldown: { [identifier: string]: number } = {};

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
    getKeys(key: number): Array<KeyInfo> | undefined {
        return keyMappings.filter((x) => x.key === key);
    },
    keyDown(key: number) {
        const keys = Internal.getKeys(key);
        for (let keyInfo of keys) {
            if (!keyInfo) {
                continue;
            }

            if (keyInfo.disabled) {
                continue;
            }

            if (typeof keyInfo.spamPreventionInMs === 'number' && keyInfo.spamPreventionInMs > 1) {
                if (keyCooldown[keyInfo.identifier] && Date.now() < keyCooldown[keyInfo.identifier]) {
                    continue;
                }

                keyCooldown[keyInfo.identifier] = Date.now() + keyInfo.spamPreventionInMs;
            }

            let overrideMenuCheck = false;
            if (keyInfo.allowInSpecificPage) {
                overrideMenuCheck = AthenaClient.webview.isPageOpen(keyInfo.allowInSpecificPage);
            }

            if (keyInfo.allowIfDead) {
                overrideMenuCheck = true;
            }

            if (!keyInfo.allowInAnyMenu && AthenaClient.webview.isAnyMenuOpen() && !overrideMenuCheck) {
                continue;
            }

            if (keyInfo.modifier && keyModifier[keyInfo.modifier] && !keyModifier[keyInfo.modifier].pressed) {
                continue;
            }

            if (keyInfo.delayedKeyDown && keyInfo.delayedKeyDown.msToTrigger >= 1) {
                keyDownTime[keyInfo.identifier] = Date.now() + keyInfo.delayedKeyDown.msToTrigger;
            }

            if (!keyInfo.keyDown) {
                continue;
            }

            keyInfo.keyDown();
        }
    },
    keyUp(key: number) {
        const keys = Internal.getKeys(key);

        for (let keyInfo of keys) {
            if (!keyInfo) {
                return;
            }

            delete keyDownTime[keyInfo.identifier];

            if (keyInfo.disabled) {
                return;
            }

            let overrideMenuCheck = false;
            if (keyInfo.allowInSpecificPage) {
                overrideMenuCheck = AthenaClient.webview.isPageOpen(keyInfo.allowInSpecificPage);
            }

            if (!keyInfo.allowInAnyMenu && AthenaClient.webview.isAnyMenuOpen() && !overrideMenuCheck) {
                return;
            }

            if (keyInfo.modifier && keyModifier[keyInfo.modifier] && !keyModifier[keyInfo.modifier].pressed) {
                return;
            }

            if (!keyInfo.keyUp) {
                return;
            }

            keyInfo.keyUp();
        }
    },
    keyHeld() {
        let isModifierDown = false;

        // Check Modifier Keys First
        Object.keys(keyModifier).forEach((keyName) => {
            if (alt.isKeyDown(keyModifier[keyName].key)) {
                keyModifier[keyName].pressed = true;
                isModifierDown = true;
            } else {
                keyModifier[keyName].pressed = false;
            }
        });

        if (isModifierDown) {
            native.disableControlAction(0, 86, true);
        }

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

/**
 * Add a key bind to the start listening for key presses.
 * https://www.toptal.com/developers/keycode
 *
 * @param {KeyInfo} keyBind
 */
export function add(keyBind: KeyInfo) {
    const userDefinedHotkey = alt.LocalStorage.get(`keybind-${keyBind.key}`);

    if (typeof userDefinedHotkey !== 'undefined') {
        keyMappings.push({ ...keyBind, default: keyBind.key, key: userDefinedHotkey });
        return;
    }

    keyMappings.push({ ...keyBind, default: keyBind.key });
}

/**
 * Used to check if a keybind passes certain validation metrics.
 * Useful for show on-screen data related to a key bind.
 * Should only be called periodically. Roughly every 500ms~1s
 *
 * @param {(string | number)} keyOrIdentifier
 */
export function checkValidation(keyOrIdentifier: string | number): boolean {
    const keyInfo = Internal.getKeyInfo(keyOrIdentifier);
    if (typeof keyInfo === 'undefined') {
        return false;
    }

    return Internal.isValidRestrictions(keyInfo.restrictions);
}

/**
 * Disble a keybind
 *
 * @param {(string | number)} keyOrIdentifier
 */
export function disable(keyOrIdentifier: string | number) {
    Internal.setDisabled(keyOrIdentifier, true);
}

/**
 * Enable a keybind
 *
 * @param {(string | number)} keyOrIdentifier
 */
export function enable(keyOrIdentifier: string | number) {
    Internal.setDisabled(keyOrIdentifier, false);
}
/**
 * Allows a key to be rebound at runtime.
 * Once a key is rebound, it will automatically be loaded on server rejoin.
 *
 * @param {string} keyOrIdentifier
 */
export function rebind(keyOrIdentifier: string | number, keyCode: number) {
    let index: number;
    if (typeof keyOrIdentifier === 'string') {
        index = keyMappings.findIndex((x) => x && x.identifier === keyOrIdentifier);
    } else {
        index = keyMappings.findIndex((x) => x.key === keyOrIdentifier);
    }

    if (index <= -1) {
        return;
    }

    if (keyMappings[index].doNotAllowRebind) {
        return;
    }

    alt.LocalStorage.set(`keybind-${keyMappings[index].default}`, keyCode);
    alt.LocalStorage.save();

    keyMappings[index].key = keyCode;
}

/**
 * Returns all hotkeys and their relevant information.
 *
 * @return {Array<KeyInfoDefault>}
 */
export function hotkeys(): Array<KeyInfoDefault> {
    return keyMappings;
}

/**
 * Return a keybind information for a key.
 * Returns undefined if key is not bound, or found.
 *
 * @param {(string | number)} keyOrIdentifier
 * @return {void}
 */
export function hotkey(keyOrIdentifier: string | number): KeyInfo | undefined {
    return Internal.getKeyInfo(keyOrIdentifier);
}

onTicksStart.add(Internal.init);
