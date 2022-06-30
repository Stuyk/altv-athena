import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance } from '../../shared/utility/vector';
import { AudioView } from '../views/audio';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, handleFrontendSound);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, handlePlayAudio3D);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, handlePlayAudio2D);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D_POSITIONAL, handlePlayAudioPositional);

/**
 * Play a sound in the frontend.
 *
 * https://altv.stuyk.com/docs/articles/tables/frontend-sounds.html
 * @param {string} audioName - The name of the audio file to play.
 * @param {string} ref - The name of the sound you want to play.
 * @returns None
 */
export function handleFrontendSound(audioName: string, ref: string): void {
    native.playSoundFrontend(-1, audioName, ref, true);
}

export function handlePlayAudioPositional(pos: alt.Vector3, soundName: string) {
    if (!pos || !soundName) {
        return;
    }

    const dist = distance(pos, alt.Player.local.pos);
    let volume = 0.35;
    let pan = 0;

    const [_, x, y] = native.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z, undefined, undefined);
    pan = x * 2 - 1;
    volume = dist / 100 / 0.35;

    if (pan < -1) {
        pan = -1;
    }

    if (pan > 1) {
        pan = 1;
    }

    if (volume > 1) {
        volume = 1;
    }

    AudioView.play3DAudio(soundName, pan, volume);
}

/**
 * Really basic 3D audio. Does not update after first play.
 * Simply plays the audio based on your position.
 * @param {alt.Entity} entity
 * @param {string} soundName
 */
export function handlePlayAudio3D(entity: alt.Entity, soundName: string): void {
    if (!entity || !soundName) {
        return;
    }

    const dist = distance(entity.pos, alt.Player.local.pos);
    let volume = 0.35;
    let pan = 0;

    if (alt.Player.local.scriptID !== entity.scriptID) {
        if (!native.isEntityOnScreen(entity.scriptID)) {
            volume -= 0.25;
        } else {
            const pos = entity.pos;
            const [_, x, y] = native.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z, undefined, undefined);
            pan = x * 2 - 1;
            volume = dist / 100 / 0.35;
        }
    } else {
        volume = 0.35;
    }

    if (pan < -1) {
        pan = -1;
    }

    if (pan > 1) {
        pan = 1;
    }

    if (volume > 1) {
        volume = 1;
    }

    AudioView.play3DAudio(soundName, pan, volume);
}
/**
 * Play a 2D sound.
 * @param {string} soundName - The name of the sound to play.
 * @param {number} volume - The volume of the sound.
 * @returns None
 */

export function handlePlayAudio2D(soundName: string, volume: number = 0.35) {
    AudioView.play3DAudio(soundName, 0, volume);
}
