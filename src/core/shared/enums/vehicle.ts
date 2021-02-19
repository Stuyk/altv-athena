/**
 * The current Vehicle Door Lock States
 * The lock state KIDNAP_MODE is for locking players in the car.
 * Use with care.
 * @export
 * @enum {number}
 */
export enum Vehicle_Lock_State {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}

export const Vehicle_Lock_States: Array<Vehicle_Lock_State> = [Vehicle_Lock_State.UNLOCKED, Vehicle_Lock_State.LOCKED];

export enum Vehicle_Seat_List {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}

export enum Vehicle_Door_List {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}

export enum Vehicle_Behavior {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32
}

export const Vehicle_Events = {
    SET_INTO: 'Vehicle-Set-Into',
    SET_LOCK: 'Vehicle-Set-Lock',
    SET_DOOR: 'Vehicle-Set-Door',
    SET_ENGINE: 'Vehicle-Set-Engine',
    SET_SEATBELT: 'Vehicle-Seatbelt'
};

export const Vehicle_State = {
    DOOR_DRIVER: `Door-${Vehicle_Door_List.DRIVER}`,
    DOOR_PASSENGER: `Door-${Vehicle_Door_List.PASSENGER}`,
    DOOR_DRIVER_REAR: `Door-${Vehicle_Door_List.DRIVER_REAR}`,
    DOOR_PASSENGER_REAR: `Door-${Vehicle_Door_List.PASSENGER_REAR}`,
    DOOR_HOOD: `Door-${Vehicle_Door_List.HOOD}`,
    DOOR_TRUNK: `Door-${Vehicle_Door_List.TRUNK}`,
    LOCK_STATE: `Door-Locks`,
    KEYS: `Vehicle-Keys`,
    OWNER: 'Vehicle-Owner',
    ENGINE: 'Vehicle-Engine',
    FUEL: 'Vehicle-Fuel'
};

/**
 * Determine if the Vehicle_Lock_State type is a locking type.
 * @export
 * @param {Vehicle_Lock_State} state
 * @return {*}  {boolean}
 */
export function inLockedState(state: Vehicle_Lock_State): boolean {
    if (state === null || state === undefined) {
        return true;
    }

    if (state === Vehicle_Lock_State.LOCKED || state === Vehicle_Lock_State.LOCKOUT_PLAYER) {
        return true;
    }

    return false;
}
