/**
 * Combine animation flags together to get the desired effect.
 * Example:
 * const upperBodyWaking = ANIMATION_FLAGS.UPPERBODY_ONLY | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL;
 * @export
 * @enum {number}
 */
export enum ANIMATION_FLAGS {
    NORMAL = 0,
    REPEAT = 1,
    STOP_LAST_FRAME = 2,
    UPPERBODY_ONLY = 16,
    ENABLE_PLAYER_CONTROL = 32,
    CANCELABLE = 120,
}
