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

export enum ATHENA_EVENTS_PLAYER_CLIENT {
    WAYPOINT = 'athena:PlayerWaypoint',
}
