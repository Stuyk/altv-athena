import * as alt from 'alt-client';
import * as native from 'natives';

let interval: number = undefined;

const CAMERA_CONTROLS = [0, 1, 2, 3, 4, 5, 6, 7, 18, 24, 25, 53, 54, 68, 69, 70, 92, 106, 142, 144, 257, 346];

const Internal = {
    tick() {
        native.disableAimCamThisUpdate();

        for (let control of CAMERA_CONTROLS) {
            native.disableControlAction(0, control, true);
        }
    },
};

/**
 * Disable the gameplay camera from moving
 *
 * @export
 * @return {void}
 */
export function disable() {
    if (typeof interval !== 'undefined') {
        return;
    }

    interval = alt.setInterval(Internal.tick, 0);
}

/**
 * Enable the gameplay camera
 *
 * @export
 * @return {void}
 */
export function enable() {
    if (typeof interval === 'undefined') {
        return;
    }

    alt.clearInterval(interval);
    interval = undefined;
}
