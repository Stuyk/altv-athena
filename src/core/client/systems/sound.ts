import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance } from '../../shared/utility/vector';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, handleFrontendSound);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, handlePlayAudio3D);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, handlePlayAudio2D);

export function handleFrontendSound(audioName: string, ref: string): void {
    native.playSoundFrontend(-1, audioName, ref, true);
}

/**
 * Really basic 3D audio. Does not update after first play.
 * Simply plays the audio based on your position.
 * @param {alt.Entity} entity
 * @param {string} soundName
 */
function handlePlayAudio3D(entity: alt.Entity, soundName: string): void {
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

    alt.emit('hud:PlayAudio3D', soundName, pan, volume);
}

function handlePlayAudio2D(soundName: string, volume: number = 0.35) {
    alt.emit('hud:PlayAudio3D', soundName, 0, volume);
}
