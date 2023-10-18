import * as alt from 'alt-shared';
import { ANIMATION_FLAGS } from '../flags/animationFlags.js';

/**
 * Used to pass animation information from server-side to client-side.
 *
 *
 * @interface Animation
 */
export interface Animation {
    /**
     * The animation dictionary for the animation.
     * @type {string}
     *
     */
    dict: string;

    /**
     * The name of the animation.
     * @type {string}
     *
     */
    name: string;

    /**
     * A bitwise enum of values that determine how an animation looks / works.
     * Combine them with 'ANIMATION_FLAGS.X | ANIMATION_FLAGS.Y'
     * @type {ANIMATION_FLAGS}
     *
     */
    flags: ANIMATION_FLAGS;

    /**
     * How long should this animation play for.
     * Set this to -1 for infinite.
     * @type {number}
     *
     */
    duration: number;
}

export interface JobAnimation extends Animation {
    /**
     * When to play this animation after a certain amount of ms.
     * @type {number}
     *
     */
    delay?: number;

    /**
     * Play the animation when the objective is loaded?
     * @type {boolean}
     *
     */
    atObjectiveStart?: boolean;

    /**
     * What direction to face when playing the animation.
     * @type {Vector3}
     *
     */
    rotation?: alt.IVector3;
}
