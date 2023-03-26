import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu';

export type PlayerMenuInjection = (target: alt.Player, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

const Injections: Array<PlayerMenuInjection> = [];

/**
 * Allows the current Menu Options to be modified.
 * Meaning, a callback that will modify existing options, or append new options to the menu.
 * Must always return the original wheel menu options + your changes.
 *
 * @param {PlayerMenuInjection} callback
 * @memberof PlayerWheelMenu
 */
export function addInjection(callback: PlayerMenuInjection) {
    Injections.push(callback);
}

/**
 * Opens the wheel menu against a target player.
 *
 * @param {alt.Player} target
 * @return {void}
 * @memberof PlayerWheelMenu
 */
export function open(target: alt.Player) {
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
