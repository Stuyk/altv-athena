import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from 'core/shared/enums/system';
import { AnimationFlags } from 'core/shared/flags/animation';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_ANIMATION, playAnimation);

const MaxLoadAttempts = 250;

/**
 * Attempts to load an animation dictionary multiple times before returning false.
 * @param {string} dict The name of the animation dictionary.
 * @param {number} [count=0] Do not modify this. Leave it as zero.
 * @return {Promise<boolean>}  {Promise<boolean>}
 */
async function loadAnimation(dict: string, count: number = 0): Promise<boolean> {
    return new Promise((resolve: Function): void => {
        const interval = alt.setInterval(() => {
            count += 1;

            if (native.hasAnimDictLoaded(dict)) {
                alt.clearInterval(interval);
                resolve(true);
                return;
            }

            if (count >= 25) {
                alt.clearInterval(interval);
                resolve(false);
                return;
            }

            native.requestAnimDict(dict);
        }, 250);
    });
}

/**
 * Play an animation for the local player.
 * @export
 * @param {string} dict The dictionary of the animation.
 * @param {string} name The name of the animation.
 * @param {AnimationFlags} [flags=AnimationFlags.CANCELABLE] A combination of flags. ie. (AnimationFlags.CANCELABLE | AnimationFlags.UPPERBODY_ONLY)
 * @return {Promise<void>}  {Promise<void>}
 */
export async function playAnimation(
    dict: string,
    name: string,
    flags: AnimationFlags = AnimationFlags.CANCELABLE,
    duration: number = -1
): Promise<void> {
    const isReadyToPlay = await loadAnimation(dict);
    if (!isReadyToPlay) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    if (native.isEntityPlayingAnim(alt.Player.local.scriptID, dict, name, 3)) {
        return;
    }

    native.taskPlayAnim(alt.Player.local.scriptID, dict, name, 8.0, -1, duration, flags, 0, false, false, false);
}
