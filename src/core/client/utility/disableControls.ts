import * as alt from 'alt-client';
import * as native from 'natives';

let everyTick: number;

/**
 * Completely disabled all local player controls.
 * @export
 * @param {boolean} value
 * @return {*}
 */
export function disableAllControls(value: boolean) {
    if (everyTick) {
        alt.clearEveryTick(everyTick);
        everyTick = null;
    }

    if (value) {
        everyTick = alt.everyTick(handleDisablingControls);
        return;
    }
}

function handleDisablingControls() {
    native.disableAllControlActions(0);
    native.disableAllControlActions(1);
}
