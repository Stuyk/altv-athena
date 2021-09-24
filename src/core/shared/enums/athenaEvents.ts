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
    LEFT_INTERIOR = 'athena:LeftInterior',
    PURCHASED_VEHICLE = 'athena:PurchasedVehicle',
    SELECTED_CHARACTER = 'athena:SelectedCharacter',
    SPAWNED = 'athena:PlayerSpawned',
    TOGGLED_INTERIOR_LOCK = 'athena:ToggleLock',
}

export enum ATHENA_EVENTS_PLAYER_CLIENT {
    WAYPOINT = 'athena:PlayerWaypoint',
}
