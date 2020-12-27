import * as alt from 'alt-client';
import * as native from 'natives';

const MaxLoadAttempts = 250;

export enum AnimationFlags {
    NORMAL = 0,
    REPEAT = 1,
    STOP_LAST_FRAME = 2,
    UPPERBODY_ONLY = 16,
    ENABLE_PLAYER_CONTROL = 32,
    CANCELABLE = 120
}

/**
 * Attempts to load an animation dictionary multiple times before returning false.
 * @param {string} dict The name of the animation dictionary.
 * @param {number} [count=0] Do not modify this. Leave it as zero.
 * @return {Promise<boolean>}  {Promise<boolean>}
 */
async function loadAnimation(dict: string, count: number = 0): Promise<boolean> {
    if (native.hasAnimDictLoaded(dict)) {
        return true;
    }

    native.requestAnimDict(dict);

    if (!native.hasAnimDictLoaded(dict)) {
        count += 1;
        if (count >= MaxLoadAttempts) {
            return false;
        }

        return await loadAnimation(dict, count);
    }

    return true;
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
    flags: AnimationFlags = AnimationFlags.CANCELABLE
): Promise<void> {
    const isReadyToPlay = await loadAnimation(dict);
    if (!isReadyToPlay) {
        return;
    }

    if (alt.Player.local.getSyncedMeta('DEAD')) {
        alt.log(`Player is dead. Could not play animation.`);
        return;
    }

    if (native.isEntityPlayingAnim(alt.Player.local.scriptID, dict, name, 3)) {
        return;
    }

    native.taskPlayAnim(alt.Player.local.scriptID, dict, name, 8.0, -1, -1, flags, 0, false, false, false);
}
