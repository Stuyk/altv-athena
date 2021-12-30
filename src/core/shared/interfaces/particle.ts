import { Vector3 } from './vector';

export interface Particle {
    /**
     * Position in a 3D space to play this effect.
     * @type {Vector3}
     * @memberof Particle
     */
    pos: Vector3;

    /**
     * Core particle name.
     * @type {string}
     * @memberof Particle
     */
    dict: string;

    /**
     * The name inside of the dictionary for the particle.
     * @type {string}
     * @memberof Particle
     */
    name: string;

    /**
     * How long to play this particle effect for.
     * @type {number}
     * @memberof Particle
     */
    duration: number;

    /**
     * Size of the particle effect.
     * @type {number}
     * @memberof Particle
     */
    scale: number;

    /**
     * Time before the particle effect starts playing.
     * @type {number}
     * @memberof Particle
     */
    delay?: number;
}
