import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu.js';

export type PlayerMenuInjection = (target: alt.Player, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

const Injections: Array<PlayerMenuInjection> = [];
let disabled = false;

/**
 * Allows the current Menu Options to be modified.
 * Meaning, a callback that will modify existing options, or append new options to the menu.
 * Must always return the original wheel menu options + your changes.
 *
 * @param {PlayerMenuInjection} callback
 *
 */
export function addInjection(callback: PlayerMenuInjection) {
    if (Overrides.addInjection) {
        return Overrides.addInjection(callback);
    }

    if (disabled) {
        return;
    }

    Injections.push(callback);
}

/**
 * Opens the wheel menu against a target player.
 *
 * @param {alt.Player} target
 * @return {void}
 *
 */
export function open(target: alt.Player) {
    if (Overrides.open) {
        return Overrides.open(target);
    }

    if (disabled) {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    if (!target || !target.valid) {
        return;
    }

    const dist = AthenaClient.utility.vector.distance(alt.Player.local.pos, target.pos);
    if (dist >= 5) {
        return;
    }

    let options: Array<IWheelOptionExt> = [];

    // Normal Wheel Options Here...

    for (const callback of Injections) {
        try {
            options = callback(target, options);
        } catch (err) {
            console.warn(`Got Player Menu Injection Error: ${err}`);
            continue;
        }
    }

    if (options.length <= 0) {
        return;
    }

    AthenaClient.systems.wheelMenu.open('Player', options);
}

/**
 * Disable the Player Wheel Menu
 *
 * @export
 */
export function disable() {
    disabled = true;
}

interface PlayerWheelMenuFuncs {
    addInjection: typeof addInjection;
    open: typeof open;
}

const Overrides: Partial<PlayerWheelMenuFuncs> = {};

export function override(functionName: 'addInjection', callback: typeof addInjection);
export function override(functionName: 'open', callback: typeof open);
export function override(functionName: keyof PlayerWheelMenuFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
