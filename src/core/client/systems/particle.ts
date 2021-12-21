import alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Particle } from '../../shared/interfaces/particle';
import { sleep } from '../utility/sleep';
import { Timer } from '../utility/timers';

alt.onServer(SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, handlePlayParticle);

function loadParticleDictionary(dictionary: string): Promise<boolean> {
    return new Promise((resolve: Function): void => {
        let count = 0;

        const interval = Timer.createInterval(
            () => {
                count += 1;

                if (native.hasNamedPtfxAssetLoaded(dictionary)) {
                    Timer.clearInterval(interval);
                    resolve(true);
                    return;
                }

                if (count >= 50) {
                    Timer.clearInterval(interval);
                    resolve(false);
                    alt.log(`Exceeded count for ${dictionary} ptfx`);
                    return;
                }

                native.requestNamedPtfxAsset(dictionary);
            },
            250,
            'particle.ts',
        );
    });
}

/**
 * Players a particle effect at a certain location.
 * @export
 * @param {Particle} data
 */
export async function handlePlayParticle(data: Particle): Promise<void> {
    const isReady = await loadParticleDictionary(data.dict);

    if (!isReady) {
        return;
    }

    if (data.delay && data.delay >= 1) {
        await sleep(data.delay);
    }

    const endTime = Date.now() + data.duration;
    const interval = Timer.createInterval(
        () => {
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
                Timer.clearInterval(interval);
                return;
            }
        },
        250,
        'particle.ts',
    );
}
