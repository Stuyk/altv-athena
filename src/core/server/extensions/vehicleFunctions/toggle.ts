import * as alt from 'alt-server';
import {
    Vehicle_Behavior,
    Vehicle_Lock_State,
    Vehicle_Lock_States,
    Vehicle_State
} from '../../../shared/enums/vehicle';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { ATHENA_EVENTS_VEHICLE } from '../../enums/athena';
import { playerFuncs } from '../Player';
import getter from './getter';
import keys from './keys';
import setter from './setter';

function lock(v: alt.Vehicle, player: alt.Player, bypass: boolean = false): Vehicle_Lock_State {
    if (!bypass) {
        if (!getter.isOwner(v, player) && !keys.has(v, player)) {
            return v.athenaLockState;
        }
    }

    if (v.athenaLockState === null || v.athenaLockState === undefined) {
        v.athenaLockState = Vehicle_Lock_State.LOCKED;

        for (let i = 0; i < 6; i++) {
            setter.doorOpen(v, player, i, false);
        }

        v.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, v.athenaLockState);
        return v.athenaLockState;
    }

    let index = Vehicle_Lock_States.findIndex((x) => x === v.athenaLockState);
    if (index + 1 === Vehicle_Lock_States.length) {
        index = -1;
    }

    v.athenaLockState = Vehicle_Lock_States[index + 1];
    v.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, v.athenaLockState);

    // Automatically Close All Doors in Locked State
    if (v.athenaLockState === Vehicle_Lock_State.LOCKED) {
        for (let i = 0; i < 6; i++) {
            setter.doorOpen(v, player, i, false);
        }
    }

    alt.emit(ATHENA_EVENTS_VEHICLE.LOCK_STATE_CHANGE, v);
    return v.athenaLockState;
}

function engine(v: alt.Vehicle, player: alt.Player, bypass: boolean = false): void {
    if (isFlagEnabled(v.behavior, Vehicle_Behavior.NEED_KEY_TO_START) && !bypass) {
        if (!getter.isOwner(v, player) && !keys.has(v, player)) {
            return;
        }
    }

    if (!getter.hasFuel(v)) {
        v.engineStatus = false;
        v.setStreamSyncedMeta(Vehicle_State.ENGINE, v.engineStatus);
        playerFuncs.emit.notification(player, `~r~No Fuel`);
        return;
    }

    v.engineStatus = !v.engineStatus;
    v.setStreamSyncedMeta(Vehicle_State.ENGINE, v.engineStatus);

    if (player) {
        playerFuncs.emit.notification(player, `Engine ~y~${v.engineStatus ? 'On' : 'Off'}`);
    }

    alt.emit(ATHENA_EVENTS_VEHICLE.ENGINE_STATE_CHANGE, v);
}

export default {
    engine,
    lock
};
