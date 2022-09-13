import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vector3 } from '../../shared/interfaces/vector';
import { distance2d } from '../../shared/utility/vector';

interface CustomSoundInfo {
    /**
     * A custom `.ogg` file name for an audio clip.
     *
     * @type {string}
     * @memberof CustomSoundInfo
     */
    audioName: string;

    /**
     * A positional Vector3 on where to play the sound from.
     *
     * @type {Vector3}
     * @memberof CustomSoundInfo
     */
    pos?: Vector3;

    /**
     * The volume between `0.0` - `1.0`.
     *
     * Recommended: `0.35`.
     *
     * @type {number}
     * @memberof CustomSoundInfo
     */
    volume?: number;

    /**
     * If you want the audio 3D specify a target to play this audio from.
     *
     * @type {alt.Entity}
     * @memberof CustomSoundInfo
     */
    target?: alt.Entity;
}

const MAX_AUDIO_AREA_DISTANCE = 25;

export class SoundSystem {
    /**
     * Play a single sound for a player.
     *
     * @static
     * @param {alt.Player} player
     * @param {CustomSoundInfo} soundInfo
     * @memberof SoundSystem
     */
    static playSound(player: alt.Player, soundInfo: CustomSoundInfo) {
        if (soundInfo.target) {
            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, soundInfo.target, soundInfo.audioName);
            return;
        }

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, soundInfo.audioName, soundInfo.volume);
    }

    /**
     * Play a custom non-frontend sound in a dimension.
     * Specify an entity to make the sound play from that specific entity.
     *
     * @static
     * @param {number} dimension
     * @param {alt.Entity} [entity=null]
     * @memberof Sound
     */
    static playSoundInDimension(dimension: number, soundInfo: Omit<CustomSoundInfo, 'pos'>) {
        const players = [...alt.Player.all].filter((t) => t.dimension === dimension);

        if (players.length <= 0) {
            return;
        }

        if (soundInfo.target) {
            alt.emitClient(players, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, soundInfo.target, soundInfo.audioName);
            return;
        }

        alt.emitClient(players, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, soundInfo.audioName, soundInfo.volume);
    }

    /**
     * Play a custom sound in a 3D position for all players in the area.
     *
     * @static
     * @param {(Required<Omit<CustomSoundInfo, 'target' | 'volume'>>)} soundInfo
     * @return {*}
     * @memberof Sound
     */
    static playSoundInArea(soundInfo: Required<Omit<CustomSoundInfo, 'target' | 'volume'>>) {
        const players = [...alt.Player.all].filter((t) => {
            const dist = distance2d(t.pos, soundInfo.pos);
            if (dist > MAX_AUDIO_AREA_DISTANCE) {
                return false;
            }

            return true;
        });

        if (players.length <= 0) {
            return;
        }

        alt.emitClient(players, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D_POSITIONAL, soundInfo.pos, soundInfo.audioName);
    }
}
