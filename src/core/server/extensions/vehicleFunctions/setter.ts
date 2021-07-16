import * as alt from 'alt-server';

import { Vehicle_Behavior, VEHICLE_STATE } from '../../../shared/enums/vehicle';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { DEFAULT_CONFIG } from '../../athena/main';
import { vehicleFuncs } from '../Vehicle';

function updateFuel(vehicle: alt.Vehicle) {
    if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
        vehicle.fuel = 100;
        vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.fuel);
        return;
    }

    if (!vehicle.engineOn) {
        vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.fuel);
        return;
    }

    if (!isNaN(vehicle.data.fuel)) {
        vehicle.fuel = vehicle.data.fuel;
    } else {
        vehicle.fuel = 100;
        vehicle.data.fuel = 100;
    }

    vehicle.fuel = vehicle.fuel - DEFAULT_CONFIG.FUEL_LOSS_PER_PLAYER_TICK;

    if (vehicle.fuel < 0) {
        vehicle.fuel = 0;

        if (vehicle.engineOn) {
            vehicle.engineOn = false;
        }
    }

    vehicle.data.fuel = vehicle.fuel;
    vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.data.fuel);
    vehicle.setSyncedMeta(VEHICLE_STATE.POSITION, vehicle.pos);

    const owner = alt.Player.all.find((p) => p.valid && p.id === vehicle.player_id);
    if (!owner) {
        try {
            vehicle.destroy();
        } catch (err) {}
        return;
    }

    if (!vehicle.nextSave || Date.now() > vehicle.nextSave) {
        vehicleFuncs.save.data(owner, vehicle);
        vehicle.nextSave = Date.now() + Math.floor(Math.random() * 30000) + 10000;
    }
}

export default {
    updateFuel
};
