import * as natives from 'natives';
import { SCREEN_EFFECTS } from '@AthenaShared/enums/screenEffects';

export const ScreenEffect = {
    /**
     * Check whether the specific screen effect is running.
     * @param {SCREEN_EFFECTS} screenEffect The ScreenEffect to check.
     * @return true if the screen effect is active; otherwise false
     */
    isEffectActive(screenEffect: SCREEN_EFFECTS) {
        return natives.animpostfxIsRunning(screenEffect);
    },

    /**
     * Starts applying the specified effect to the screen.
     * @param {SCREEN_EFFECTS} screenEffect The ScreenEffect to start playing.
     * @param {number} duration The duration of the effect in milliseconds or zero to use the default length.
     * @param {boolean} looped If true the effect won't stop until stopEffect(ScreenEffect) is called.
     */
    startEffect(screenEffect: SCREEN_EFFECTS, duration = 0, looped = false) {
        natives.animpostfxPlay(screenEffect, duration, looped);
    },

    /**
     * Stops applying the specified effect to the screen.
     * @param {SCREEN_EFFECTS} screenEffect The ScreenEffect to stop playing.
     */
    stopEffect(screenEffect: SCREEN_EFFECTS) {
        natives.animpostfxStop(screenEffect);
    },

    /**
     * Stops all currently running effects.
     */
    stopAllEffects() {
        natives.animpostfxStopAll();
    },
};
