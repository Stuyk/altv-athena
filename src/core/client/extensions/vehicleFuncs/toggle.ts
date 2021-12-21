import * as alt from 'alt-client';
import * as native from 'natives';
import { Vehicle_Door_List } from '../../../shared/enums/vehicle';

/**
 * Toggle a local vehicle's door state.
 * Does not sync up with server.
 * @param {number} door
 * @memberof Vehicle
 */
function door(v: alt.Vehicle, door: Vehicle_Door_List): void {
    if (!v.doorStates) {
        v.doorStates = {};
    }

    v.doorStates[door] = !v.doorStates[door] ? true : false;

    if (!v.doorStates[door]) {
        native.setVehicleDoorShut(v.scriptID, door, false);
        return;
    }

    native.setVehicleDoorOpen(v.scriptID, door, false, false);
}

export default {
    door,
};
