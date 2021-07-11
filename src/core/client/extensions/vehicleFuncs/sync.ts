import * as alt from 'alt-client';
import * as native from 'natives';
import { VEHICLE_DOOR_STATE } from '../../../shared/enums/vehicle';

function update(vehicle: alt.Vehicle): void {
    // Synchronize Doors
    Object.keys(VEHICLE_DOOR_STATE).forEach((key, index) => {
        const value = vehicle.getStreamSyncedMeta(VEHICLE_DOOR_STATE[key]);
        if (value === null || value === undefined || value === false) {
            native.setVehicleDoorShut(vehicle.scriptID, index, true);
        } else {
            native.setVehicleDoorOpen(vehicle.scriptID, index, false, true);
        }
    });
}

export default {
    update
};
