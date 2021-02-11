import * as alt from 'alt-server';
import getter from './getter';
import { Vehicle_Door_List, Vehicle_Lock_State, Vehicle_State } from '../../../shared/enums/vehicle';
import { playerFuncs } from '../Player';
import keys from './keys';
import toggle from './toggle';

function lock(v: alt.Vehicle, player: alt.Player, lockState: Vehicle_Lock_State): boolean {
    if (!getter.isOwner(v, player) && !keys.has(v, player)) {
        return false;
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
    if (!bypass) {
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

function owner(v: alt.Vehicle, player: alt.Player | number): void {
    if (player instanceof alt.Player) {
        v.owner = player.id;
    } else {
        v.owner = player;
    }

    v.setStreamSyncedMeta(Vehicle_State.OWNER, v.owner);

    if (player instanceof alt.Player) {
        toggle.lock(v, player, false);
    } else {
        toggle.lock(v, null, true);
    }
}

export default {
    lock,
    owner,
    doorOpen
};
