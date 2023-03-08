import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Removes the black filter on a screen over time.
 *
 * @export
 * @param {number} timeInMs
 */
export function fadeFromBlack(timeInMs: number) {
    native.doScreenFadeOut(timeInMs);
}

/**
 * Turns a screen black over time.
 *
 * @export
 * @param {number} timeInMs
 */
export function fadeToBlack(timeInMs: number) {
    native.doScreenFadeIn(timeInMs);
}

alt.onServer(SYSTEM_EVENTS.SCREEN_FADE_FROM_BLACK, fadeFromBlack);
alt.onServer(SYSTEM_EVENTS.SCREEN_FADE_TO_BLACK, fadeToBlack);
