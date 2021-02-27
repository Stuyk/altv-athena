/**
 * First argument from an `alt.on` event should always be a vehicle.
 * @export
 * @enum {number}
 */
export enum ATHENA_EVENTS_VEHICLE {
    DESPAWNED = 'athena:VehicleDespawned',
    ENGINE_STATE_CHANGE = 'athena:VehicleEngineState',
    LOCK_STATE_CHANGE = 'athena:VehicleLockState',
    SPAWNED = 'athena:VehicleSpawned',
    REPAIRED = 'athena:VehicleRepaired'
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
    SELECTED_CHARACTER = 'athena:SelectedCharacter',
    SPAWNED = 'athena:PlayerSpawned'
}
