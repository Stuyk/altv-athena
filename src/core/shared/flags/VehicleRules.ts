/**
 * An enum that defines vehicle checks / behavior propogation.
 *
 * ENTER - has seat for data
 * EXIT - no extra data
 * LOCK - no extra data
 * UNLOCK - no extra data
 * STORAGE - no extra data
 * ENGINE - no extra data
 * DOOR - has door for data
 * @export
 * @enum {number}
 */
export const enum VEHICLE_RULES {
    ENTER = 'vehicle-enter',
    EXIT = 'vehicle-exit',
    LOCK = 'vehicle-lock',
    UNLOCK = 'vehicle-unlock',
    STORAGE = 'vehicle-storage',
    ENGINE = 'vehicle-engine',
    DOOR = 'vehicle-door',
}
