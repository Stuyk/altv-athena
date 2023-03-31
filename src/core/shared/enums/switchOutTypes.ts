/**
 *
 * @ignore
 *
 * @enum {number}
 */
export enum SWITCHOUT_TYPES {
    /**
     * Camera will go up in the sky in 3 steps.
     * @Note Work well on Mount Chiliad
     */
    THREE_STEPS = 1,

    /**
     * Camera will go up in the sky in 1 step.
     * @Note One step doesn't work well on Mount Chiliad
     */
    ONE_STEP,
}
