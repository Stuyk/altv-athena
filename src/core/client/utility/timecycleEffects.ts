import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { RecommendedTimecycleTypes } from '@AthenaShared/enums/timecycleTypes';
import * as alt from 'alt-client';
import * as native from 'natives';

let timeout: number;

/**
 * Applies a time cycle effect to the player's screen.
 *
 * @export
 * @param {string} timeCycleName
 */
export function setTimeCycleEffect(timeCycleName: RecommendedTimecycleTypes | string, timeInMs: number) {
    native.setTimecycleModifier(timeCycleName);

    if (timeInMs <= 0) {
        return;
    }

    if (timeout) {
        alt.clearTimeout(timeout);
        timeout = undefined;
    }

    timeout = alt.setTimeout(clearTimeCycleEffect, timeInMs);
}

/**
 * Removes all time cycle effects on the player's screen.
 *
 * @export
 */
export function clearTimeCycleEffect() {
    native.clearTimecycleModifier();
}

alt.onServer(SYSTEM_EVENTS.SCREEN_TIMECYCLE_EFFECT, setTimeCycleEffect);
alt.onServer(SYSTEM_EVENTS.SCREEN_TIMECYCLE_EFFECT_CLEAR, clearTimeCycleEffect);
alt.on('disconnect', clearTimeCycleEffect);
