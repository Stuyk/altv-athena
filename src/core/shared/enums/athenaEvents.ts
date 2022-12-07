/**
 * First argument from an `alt.on` event should always be a vehicle.
 * @export
 * @enum {number}
 */
export enum ATHENA_EVENTS_VEHICLE {
    DESPAWNED = 'athena:VehicleDespawned',
    ENGINE_STATE_CHANGE = 'athena:VehicleEngineState',
    LOCK_STATE_CHANGE = 'athena:VehicleLockState',
    REPAIRED = 'athena:VehicleRepaired',
    SPAWNED = 'athena:VehicleSpawned',
    DISTANCE_TRAVELED = 'athena:DistanceTraveled',
    DESTROYED = 'athena:VehicleDestroyed',
}

/**
 * First argument from an `alt.on` event should always be a player.
 * Server-side only.
 * @export
 * @enum {number}
 */
export enum ATHENA_EVENTS_PLAYER {
    DIED = 'athena:PlayerDied',
    DROPPED_ITEM = 'athena:PlayerDroppedItem',
    ENTERED_INTERIOR = 'athena:EnteredInterior',
    FINISHED_LOGIN = 'athena:set:account:Data',
    LEFT_INTERIOR = 'athena:LeftInterior',
    PURCHASED_VEHICLE = 'athena:PurchasedVehicle',
    SELECTED_CHARACTER = 'athena:SelectedCharacter',
    SPAWNED = 'athena:PlayerSpawned',
    TOGGLED_INTERIOR_LOCK = 'athena:ToggleLock',
    EQUIPPED_WEAPON = 'athena:equipped:weapon',
    UNEQUIPPED_WEAPON = 'athena:unequipped:weapon',
}

export enum ATHENA_EVENTS_PLAYER_CLIENT {
    WAYPOINT = 'athena:PlayerWaypoint',
}
