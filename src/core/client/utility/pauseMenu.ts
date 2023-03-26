import * as alt from 'alt-client';
import * as native from 'natives';

let interval: number = undefined;

const PAUSE_CONTROLS = [199, 200];

const Internal = {
    tick() {
        native.disableAimCamThisUpdate();

        for (let control of PAUSE_CONTROLS) {
            native.disableControlAction(0, control, true);
            native.disableControlAction(1, control, true);
        }
    },
};

/**
 * Disable the default GTA:V pause Menu
 *
 *
 * @return {void}
 */
export function disable() {
    if (typeof interval !== 'undefined') {
        return;
    }

    interval = alt.setInterval(Internal.tick, 0);
}

/**
 * Enable the default GTA:V pause menu
 *
 *
 * @return {void}
 */
export function enable() {
    if (typeof interval === 'undefined') {
        return;
    }

    alt.clearInterval(interval);
    interval = undefined;
}
