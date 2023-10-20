import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Removes the black filter on a screen over time.
 *
 *
 * @param {number} timeInMs
 */
export async function fromBlack(timeInMs: number) {
    await alt.Utils.waitFor(() => native.isScreenFadedIn() === true || native.isScreenFadingIn() === false);
    native.doScreenFadeIn(timeInMs);
}

/**
 * Turns a screen black over time.
 *
 *
 * @param {number} timeInMs
 */
export async function toBlack(timeInMs: number) {
    await alt.Utils.waitFor(() => native.isScreenFadedOut() === true || native.isScreenFadingOut() === false);
    native.doScreenFadeOut(timeInMs);
}

alt.onServer(SYSTEM_EVENTS.SCREEN_FADE_FROM_BLACK, fromBlack);
alt.onServer(SYSTEM_EVENTS.SCREEN_FADE_TO_BLACK, toBlack);
