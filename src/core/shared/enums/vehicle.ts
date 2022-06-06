/**
 * The current Vehicle Door Lock States
 * The lock state KIDNAP_MODE is for locking players in the car.
 * Use with care.
 * @export
 * @enum {number}
 */
export const VEHICLE_LOCK_STATE = {
    NO_LOCK: 0,
    UNLOCKED: 1,
    LOCKED: 2,
    LOCKOUT_PLAYER: 3,
    KIDNAP_MODE: 4,
};

export enum Vehicle_Seat_List {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2,
}

export enum Vehicle_Door_List {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5,
}

export enum Vehicle_Behavior {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32,
}

export const VEHICLE_EVENTS = {
    ACTION: 'Vehicle-Action',
    INVOKE: 'Vehicle-Invoke',
    SET_INTO: 'Vehicle-Set-Into',
    SET_LOCK: 'Vehicle-Set-Lock',
    SET_DOOR: 'Vehicle-Set-Door',
    SET_ENGINE: 'Vehicle-Set-Engine',
    SET_SEATBELT: 'Vehicle-Seatbelt',
    OPEN_STORAGE: 'Vehicle-Open-Storage',
    PUSH: 'Vehicle-Push',
    STOP_PUSH: 'Vehicle-Stop-Push',
};

export const VEHICLE_DOOR_STATE = {
    DOOR_DRIVER: `Door-${Vehicle_Door_List.DRIVER}`,
    DOOR_PASSENGER: `Door-${Vehicle_Door_List.PASSENGER}`,
    DOOR_DRIVER_REAR: `Door-${Vehicle_Door_List.DRIVER_REAR}`,
    DOOR_PASSENGER_REAR: `Door-${Vehicle_Door_List.PASSENGER_REAR}`,
    DOOR_HOOD: `Door-${Vehicle_Door_List.HOOD}`,
    DOOR_TRUNK: `Door-${Vehicle_Door_List.TRUNK}`,
};

export const VEHICLE_STATE = {
    LOCK: `Vehicle-Lock`,
    KEYS: `Vehicle-Keys`,
    OWNER: 'Vehicle-Owner',
    ENGINE: 'Vehicle-Engine',
    FUEL: 'Vehicle-Fuel',
    POSITION: 'Vehicle-Position',
    LOCKSYMBOL: 'Vehicle-Locksymbol',
    LOCK_INTERACTION_INFO: 'Vehicle-LockInteractionInfo',
};