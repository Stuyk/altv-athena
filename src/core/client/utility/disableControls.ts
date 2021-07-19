import * as alt from 'alt-client';
import * as native from 'natives';
import { Timer } from './timers';

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
        Timer.clearInterval(everyTickControls);
        everyTickControls = null;
    }

    if (value) {
        everyTickControls = Timer.createInterval(handleDisablingControls, 0, 'disableControls.ts - All');
        return;
    }
}

export function disableAllAttacks(value: boolean) {
    if (everyTickAttacks) {
        Timer.clearInterval(everyTickAttacks);
        everyTickAttacks = null;
    }

    if (value) {
        everyTickAttacks = Timer.createInterval(handleDisablingAttacks, 0, 'disableControls.ts - Attacks');
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
