import * as alt from 'alt-client';
import * as native from 'natives';
import { Vehicle_Door_List, VEHICLE_LOCK_STATE } from '../../../shared/enums/vehicle';
import { BaseHUD, HudEventNames } from '../../views/hud/hud';

/**
 * Set the owner of this vehicle locally.
 * @param {*} id
 * @memberof Vehicle
 */
function owner(v: alt.Vehicle, id: number): void {
    v.owner = id;
}

/**
 * Force all doors to be closed.
 * @memberof Vehicle
 */
function allDoorsClosed(v: alt.Vehicle): void {
    if (!this.doorStates) {
        this.doorStates = {};
    }

    for (let doorIndex in Vehicle_Door_List) {
        v.doorStates[doorIndex] = false;

        if (!native.isVehicleDoorFullyOpen(v.scriptID, parseInt(doorIndex))) {
            continue;
        }

        native.setVehicleDoorShut(v.scriptID, parseInt(doorIndex), false);
    }
}

function fuel(v: alt.Vehicle, value: number) {
    v.fuel = value;

    if (!alt.Player.local.vehicle) {
        return;
    }

    if (alt.Player.local.vehicle.id === v.id) {
        BaseHUD.setHudStatus(HudEventNames.Fuel, value);
    }
}

export default {
    allDoorsClosed,
    fuel,
    owner
};
