import * as alt from 'alt-client';
import { distance } from '../../shared/utility/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WheelMenu } from '../views/wheelMenu';

type PlayerMenuInjection = (target: alt.Player, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

const Injections: Array<PlayerMenuInjection> = [];

export class PlayerWheelMenu {
    /**
     * Allows the current Menu Options to be modified.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {PlayerMenuInjection} callback
     * @memberof PlayerWheelMenu
     */
    static addInjection(callback: PlayerMenuInjection) {
        Injections.push(callback);
    }

    /**
     * Opens the wheel menu against a target player.
     *
     * @static
     * @param {alt.Player} target
     * @return {*}
     * @memberof PlayerWheelMenu
     */
    static openMenu(target: alt.Player) {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!target || !target.valid) {
            return;
        }

        const dist = distance(alt.Player.local.pos, target.pos);
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

        WheelMenu.open('Player', options);
    }
}
