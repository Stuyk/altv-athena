import * as alt from 'alt-shared';

/**
 * Used to pass particle information from server to client.
 *
 *
 * @interface Particle
 */
export interface Particle {
    /**
     * Position in a 3D space to play this effect.
     * @type {Vector3}
     *
     */
    pos: alt.IVector3;

    /**
     * Core particle name.
     * @type {string}
     *
     */
    dict: string;

    /**
     * The name inside of the dictionary for the particle.
     * @type {string}
     *
     */
    name: string;

    /**
     * How long to play this particle effect for.
     * @type {number}
     *
     */
    duration: number;

    /**
     * Size of the particle effect.
     * @type {number}
     *
     */
    scale: number;

    /**
     * Time before the particle effect starts playing.
     * @type {number}
     *
     */
    delay?: number;
}
