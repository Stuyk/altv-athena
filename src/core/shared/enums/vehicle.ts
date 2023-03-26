/**
 * The current Vehicle Door Lock States
 * The lock state KIDNAP_MODE is for locking players in the car.
 * Use with care.
 *
 * @ignore
 *
 * @enum {number}
 */
export const VEHICLE_LOCK_STATE = {
    NO_LOCK: 0,
    UNLOCKED: 1,
    LOCKED: 2,
    LOCKOUT_PLAYER: 3,
    KIDNAP_MODE: 4,
};

/**
 *
 * @ignore
 *
 */
export const VEHICLE_EVENTS = {
    ACTION: 'Vehicle-Action',
    INVOKE: 'Vehicle-Invoke',
    SET_INTO: 'Vehicle-Set-Into',
    SET_LOCK: 'Vehicle-Set-Lock',
    SET_DOOR: 'Vehicle-Set-Door',
    SET_ENGINE: 'Vehicle-Set-Engine',
    SET_SEATBELT: 'Vehicle-Seatbelt',
    PUSH: 'Vehicle-Push',
    STOP_PUSH: 'Vehicle-Stop-Push',
};
