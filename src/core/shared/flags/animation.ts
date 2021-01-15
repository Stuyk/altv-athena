/**
 * Combine animation flags together to get the desired effect.
 * Example:
 * const upperBodyWaking = AnimationFlags.UPPERBODY_ONLY | AnimationFlags.ENABLE_PLAYER_CONTROL;
 * @export
 * @enum {number}
 */
export enum AnimationFlags {
    NORMAL = 0,
    REPEAT = 1,
    STOP_LAST_FRAME = 2,
    UPPERBODY_ONLY = 16,
    ENABLE_PLAYER_CONTROL = 32,
    CANCELABLE = 120
}
