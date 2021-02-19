import * as alt from 'alt-server';
import { Vehicle_Behavior, Vehicle_Lock_State } from '../../shared/enums/vehicle';
import getter from './vehicleFunctions/getter';
import keys from './vehicleFunctions/keys';
import newRef from './vehicleFunctions/new';
import save from './vehicleFunctions/save';
import setter from './vehicleFunctions/setter';
import toggle from './vehicleFunctions/toggle';
import utility from './vehicleFunctions/utility';
import * as IVeh from '../../shared/interfaces/Vehicle';

/**
 * Overwrites the default functionality of vehicles.
 * Uses stream synced meta to fix vehicle controls.
 */

declare module 'alt-server' {
    export interface Vehicle {
        athenaLockState: Vehicle_Lock_State;
        engineStatus: boolean;
        keys?: Array<string>;
        fuel?: number;
        player_id?: number;
        behavior?: Vehicle_Behavior;
        data?: Partial<IVeh.Vehicle>; // Special Vehicle Information
        nextSave?: number;
        nextUpdate?: number;
    }
}

export default function onLoad() {
    //
}

export const vehicleFuncs = {
    getter,
    setter,
    new: newRef,
    keys,
    save,
    toggle,
    utility
};
