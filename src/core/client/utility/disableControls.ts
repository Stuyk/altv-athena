import * as alt from 'alt-client';
import * as native from 'natives';

let everyTickControls: number;
let everyTickAttacks: number;

/**
 * Completely disabled all local player controls.
 * @export
 * @param {boolean} value
 * @return {*}
 */
export function disableAllControls(value: boolean) {
    if (everyTickControls) {
        alt.clearInterval(everyTickControls);
        everyTickControls = null;
    }

    if (value) {
        everyTickControls = alt.setInterval(handleDisablingControls, 0);
        return;
    }
}

export function disableAllAttacks(value: boolean) {
    if (everyTickAttacks) {
        alt.clearInterval(everyTickAttacks);
        everyTickAttacks = null;
    }

    if (value) {
        everyTickAttacks = alt.setInterval(handleDisablingAttacks, 0);
        return;
    }
}

function handleDisablingAttacks() {
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
    native.disableControlAction(0, 47, true);
    native.disableControlAction(0, 53, true);
    native.disableControlAction(0, 54, true);
    native.disableControlAction(0, 58, true);
    native.disableControlAction(0, 66, true);
    native.disableControlAction(0, 67, true);
    native.disableControlAction(0, 68, true);
    native.disableControlAction(0, 69, true);
    native.disableControlAction(0, 70, true);
    native.disableControlAction(0, 92, true);
    native.disableControlAction(0, 114, true);
    native.disableControlAction(0, 140, true);
    native.disableControlAction(0, 141, true);
    native.disableControlAction(0, 142, true);
    native.disableControlAction(0, 257, true);
    native.disableControlAction(0, 263, true);
    native.disableControlAction(0, 264, true);
    native.disableControlAction(0, 331, true);
}

function handleDisablingControls() {
    native.disableAllControlActions(0);
    native.disableAllControlActions(1);
}
