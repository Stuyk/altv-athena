import * as alt from 'alt-server';
import { Vehicle_Lock_State, Vehicle_Lock_States, Vehicle_State } from '../../../shared/enums/vehicle';
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

    return v.athenaLockState;
}

function engine(v: alt.Vehicle, player: alt.Player): void {
    if (!getter.isOwner(v, player) && !keys.has(v, player)) {
        return;
    }

    v.engineStatus = !v.engineStatus ? true : false;
    v.setStreamSyncedMeta(Vehicle_State.ENGINE, v.engineStatus);
    playerFuncs.emit.notification(player, `Engine ~y~${v.engineStatus ? 'On' : 'Off'}`);
}

export default {
    engine,
    lock
};
