import * as alt from 'alt-server';

import { Vehicle_Behavior, VEHICLE_STATE } from '../../../shared/enums/vehicle';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { DEFAULT_CONFIG } from '../../athena/main';
import { vehicleFuncs } from '../Vehicle';
import getter from './getter';
import keys from './keys';

function updateFuel(v: alt.Vehicle) {
    if (isFlagEnabled(v.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
        v.fuel = 100;
        v.setSyncedMeta(VEHICLE_STATE.FUEL, v.fuel);
        return;
    }

    if (!v.engineOn) {
        v.setSyncedMeta(VEHICLE_STATE.FUEL, v.fuel);
        return;
    }

    if (!isNaN(v.data.fuel)) {
        v.fuel = v.data.fuel;
    } else {
        v.fuel = 100;
        v.data.fuel = 100;
    }

    v.fuel = v.fuel - DEFAULT_CONFIG.FUEL_LOSS_PER_PLAYER_TICK;

    if (v.fuel < 0) {
        v.fuel = 0;

        if (v.engineOn) {
            v.engineOn = false;
        }
    }

    v.data.fuel = v.fuel;
    v.setStreamSyncedMeta(VEHICLE_STATE.FUEL, v.data.fuel);

    const owner = alt.Player.all.find((p) => p.valid && p.id === v.player_id);
    if (!owner) {
        try {
            v.destroy();
        } catch (err) {}
        return;
    }

    if (!v.nextSave || Date.now() > v.nextSave) {
        vehicleFuncs.save.data(owner, v);
        v.nextSave = Date.now() + Math.floor(Math.random() * 30000) + 10000;
    }
}

export default {
    updateFuel
};
