import { ANIMATION_FLAGS } from '../flags/animationFlags';
import { Vector3 } from './vector';

export interface Animation {
    /**
     * The animation dictionary for the animation.
     * @type {string}
     * @memberof Animation
     */
    dict: string;

    /**
     * The name of the animation.
     * @type {string}
     * @memberof Animation
     */
    name: string;

    /**
     * A bitwise enum of values that determine how an animation looks / works.
     * Combine them with 'ANIMATION_FLAGS.X | ANIMATION_FLAGS.Y'
     * @type {ANIMATION_FLAGS}
     * @memberof Animation
     */
    flags: ANIMATION_FLAGS;

    /**
     * How long should this animation play for.
     * Set this to -1 for infinite.
     * @type {number}
     * @memberof Animation
     */
    duration: number;
}

export interface JobAnimation extends Animation {
    /**
     * When to play this animation after a certain amount of ms.
     * @type {number}
     * @memberof JobAnimation
     */
    delay?: number;

    /**
     * Play the animation when the objective is loaded?
     * @type {boolean}
     * @memberof JobAnimation
     */
    atObjectiveStart?: boolean;

    /**
     * What direction to face when playing the animation.
     * @type {Vector3}
     * @memberof JobAnimation
     */
    rotation?: Vector3;
}
