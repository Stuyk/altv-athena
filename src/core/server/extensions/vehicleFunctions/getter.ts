import * as alt from 'alt-server';
import { Vehicle_Lock_State } from '../../../shared/enums/vehicle';

function lockState(v: alt.Vehicle): Vehicle_Lock_State {
    if (v.athenaLockState === null || v.athenaLockState === undefined) {
        return Vehicle_Lock_State.LOCKED;
    }

    return v.athenaLockState;
}

function isOwner(v: alt.Vehicle, target: alt.Player | number): boolean {
    // If the vehicle has a null owner. There is no owner.
    if (!v.owner) {
        return true;
    }

    if (target instanceof alt.Player) {
        if (v.owner !== target.id) {
            return false;
        }
    } else {
        if (v.owner !== target) {
            return false;
        }
    }

    return true;
}

export default { isOwner, lockState };
