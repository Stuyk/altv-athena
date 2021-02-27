import * as alt from 'alt-server';
import { Vehicle_Behavior, Vehicle_Lock_State } from 'core/shared/enums/vehicle';
import { isFlagEnabled } from 'core/shared/utility/flags';

function lockState(v: alt.Vehicle): Vehicle_Lock_State {
    if (v.athenaLockState === null || v.athenaLockState === undefined) {
        return Vehicle_Lock_State.LOCKED;
    }

    return v.athenaLockState;
}

function hasFuel(v: alt.Vehicle): boolean {
    if (isFlagEnabled(v.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
        return true;
    }

    if (v.fuel <= 0) {
        return false;
    }

    return true;
}

function isOwner(v: alt.Vehicle, target: alt.Player): boolean {
    // If the vehicle has a null owner. There is no owner.
    if (v.player_id === null || v.player_id === undefined) {
        return true;
    }

    if (v.player_id !== target.id) {
        return false;
    }

    return true;
}

export default { isOwner, lockState, hasFuel };
