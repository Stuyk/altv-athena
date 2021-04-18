import * as alt from 'alt-server';
import getter from './getter';
import { Vehicle_Behavior, Vehicle_Door_List, Vehicle_Lock_State, Vehicle_State } from '../../../shared/enums/vehicle';
import keys from './keys';
import toggle from './toggle';
import { DEFAULT_CONFIG } from '../../athena/main';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { vehicleFuncs } from '../Vehicle';
import { AresFunctions, WASM } from '../../utility/wasmLoader';

const wasm = WASM.getFunctions<AresFunctions>('ares');

function lock(v: alt.Vehicle, player: alt.Player, lockState: Vehicle_Lock_State): boolean {
    if (!isFlagEnabled(v.behavior, Vehicle_Behavior.NO_KEY_TO_LOCK)) {
        if (!getter.isOwner(v, player) && !keys.has(v, player)) {
            return false;
        }
    }

    v.athenaLockState = lockState;
    v.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, v.athenaLockState);

    // Automatically Close All Doors in Locked State
    if (v.athenaLockState === Vehicle_Lock_State.LOCKED) {
        for (let i = 0; i < 6; i++) {
            doorOpen(v, player, i, false);
        }
    }

    return true;
}

function doorOpen(
    v: alt.Vehicle,
    player: alt.Player,
    index: Vehicle_Door_List,
    state: boolean,
    bypass: boolean = false
): void {
    if (!isFlagEnabled(v.bodyHealth, Vehicle_Behavior.NO_KEY_TO_LOCK) && !bypass) {
        if (!getter.isOwner(v, player) && !keys.has(v, player) && getter.lockState(v) !== Vehicle_Lock_State.UNLOCKED) {
            return;
        }
    }

    // alt.log(`${doorName}: ${oppositeValue}`);
    const doorName = `DOOR_${Vehicle_Door_List[index]}`;
    if (!doorName) {
        return;
    }

    const stateName = Vehicle_State[`${doorName}`];
    v.setStreamSyncedMeta(stateName, state);
}

function updateFuel(v: alt.Vehicle) {
    if (isFlagEnabled(v.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
        v.fuel = 100;
        v.setSyncedMeta(Vehicle_State.FUEL, v.fuel);
        return;
    }

    if (!v.engineStatus) {
        v.setSyncedMeta(Vehicle_State.FUEL, v.fuel);
        return;
    }

    if (!isNaN(v.data.fuel)) {
        v.fuel = v.data.fuel;
    } else {
        v.fuel = 100;
        v.data.fuel = 100;
    }

    v.fuel = wasm.AthenaMath.sub(v.fuel, DEFAULT_CONFIG.FUEL_LOSS_PER_PLAYER_TICK);

    if (v.fuel < 0) {
        v.fuel = 0;

        if (v.engineStatus) {
            toggle.engine(v, null, true);
        }
    }

    v.data.fuel = v.fuel;
    v.setStreamSyncedMeta(Vehicle_State.FUEL, v.data.fuel);

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
    lock,
    doorOpen,
    updateFuel
};
