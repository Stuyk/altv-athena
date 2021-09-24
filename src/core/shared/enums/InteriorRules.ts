/**
 * An enum that defines interior checks / behavior propagation
 * ENTER
 * EXIT
 * @export
 * @enum {number}
 */
export const enum INTERIOR_RULES {
    ENTER = 'interior-enter',
    EXIT = 'interior-exit',
    LOCK = 'interior-lock',
    UNLOCK = 'interior-unlock',
}
