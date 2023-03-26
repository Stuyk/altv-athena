import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Removes the black filter on a screen over time.
 *
 *
 * @param {number} timeInMs
 */
export function fromBlack(timeInMs: number) {
    native.doScreenFadeOut(timeInMs);
}

/**
 * Turns a screen black over time.
 *
 *
 * @param {number} timeInMs
 */
export function toBlack(timeInMs: number) {
    native.doScreenFadeIn(timeInMs);
}

alt.onServer(SYSTEM_EVENTS.SCREEN_FADE_FROM_BLACK, fromBlack);
alt.onServer(SYSTEM_EVENTS.SCREEN_FADE_TO_BLACK, toBlack);
