import alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { Particle } from '@AthenaShared/interfaces/particle.js';

function loadParticleDictionary(dictionary: string): Promise<boolean> {
    return new Promise((resolve: Function): void => {
        let count = 0;

        const interval = alt.setInterval(() => {
            count += 1;

            if (native.hasNamedPtfxAssetLoaded(dictionary)) {
                alt.clearInterval(interval);
                resolve(true);
                return;
            }

            if (count >= 50) {
                alt.clearInterval(interval);
                resolve(false);
                alt.log(`Exceeded count for ${dictionary} ptfx`);
                return;
            }

            native.requestNamedPtfxAsset(dictionary);
        }, 250);
    });
}

/**
 * Players a particle effect at a certain location.
 *
 * @param {Particle} data
 */
export async function handlePlayParticle(data: Particle): Promise<void> {
    const isReady = await loadParticleDictionary(data.dict);

    if (!isReady) {
        return;
    }

    if (data.delay && data.delay >= 1) {
        await alt.Utils.wait(data.delay);
    }

    const endTime = Date.now() + data.duration;
    const interval = alt.setInterval(() => {
        native.useParticleFxAsset(data.dict);
        native.startParticleFxNonLoopedAtCoord(
            data.name,
            data.pos.x,
            data.pos.y,
            data.pos.z,
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            data.scale,
            false,
            false,
            false,
        );

        if (Date.now() > endTime) {
            native.stopFireInRange(data.pos.x, data.pos.y, data.pos.z, 10);
            alt.clearInterval(interval);
            return;
        }
    }, 250);
}

alt.onServer(SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, handlePlayParticle);
