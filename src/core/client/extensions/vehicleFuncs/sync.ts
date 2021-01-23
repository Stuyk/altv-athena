import * as alt from 'alt-client';
import * as native from 'natives';
import { Vehicle_State } from '../../../shared/enums/vehicle';

function update(v: alt.Vehicle): void {
    // Synchronize All States for Local Data

    if (!v.doorStates) {
        v.doorStates = {};
    }

    v.engineStatus = v.getStreamSyncedMeta(Vehicle_State.ENGINE);
    v.doorStates[0] = v.getStreamSyncedMeta(Vehicle_State.DOOR_DRIVER);
    v.doorStates[1] = v.getStreamSyncedMeta(Vehicle_State.DOOR_PASSENGER);
    v.doorStates[2] = v.getStreamSyncedMeta(Vehicle_State.DOOR_DRIVER_REAR);
    v.doorStates[3] = v.getStreamSyncedMeta(Vehicle_State.DOOR_PASSENGER_REAR);
    v.doorStates[4] = v.getStreamSyncedMeta(Vehicle_State.DOOR_HOOD);
    v.doorStates[5] = v.getStreamSyncedMeta(Vehicle_State.DOOR_TRUNK);
    v.lockStatus = v.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);

    native.setVehicleEngineOn(v.scriptID, v.engineStatus, false, false);

    Object.keys(v.doorStates).forEach((doorNumber) => {
        if (v.doorStates[doorNumber]) {
            native.setVehicleDoorOpen(v.scriptID, parseInt(doorNumber), false, true);
        } else {
            native.setVehicleDoorShut(v.scriptID, parseInt(doorNumber), true);
        }
    });
}

export default {
    update
};
