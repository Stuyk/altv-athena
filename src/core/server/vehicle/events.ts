import * as alt from 'alt-server';

export type AthenaVehicleEvents =
    | 'engine-started'
    | 'engine-stopped'
    | 'door-opened'
    | 'door-closed'
    | 'doors-locked'
    | 'doors-unlocked'
    | 'vehicle-spawned'
    | 'vehicle-repaired';

const vehicleEvents: Array<{ eventName: string; callback: (vehicle: alt.Vehicle, ...args: any[]) => void }> = [];

/**
 * Usually called by internal functions. Can be used to manually trigger an Athena Event though.
 * @static
 * @param {AthenaVehicleEvents} eventName
 * @param {alt.Vehicle} vehicle
 * @memberof VehicleEvents
 */
export function trigger<CustomEvents = AthenaVehicleEvents>(
    eventName: CustomEvents,
    vehicle: alt.Vehicle,
    ...args: any[]
) {
    for (let i = 0; i < vehicleEvents.length; i++) {
        if (vehicleEvents[i].eventName !== eventName) {
            continue;
        }

        vehicleEvents[i].callback(vehicle, ...args);
    }
}

/**
 * Trigger a callback specific to Athena Vehicle Events.
 * @static
 * @param {AthenaVehicleEvents} eventName
 * @param {(player: alt.Player) => void} callback
 * @memberof VehicleEvents
 */
export function on<CustomEvents = AthenaVehicleEvents>(
    eventName: CustomEvents,
    callback: (vehicle: alt.Vehicle, ...args: any[]) => void,
) {
    vehicleEvents.push({ eventName: String(eventName), callback });
}
