import * as alt from 'alt-server';
import { Vehicle_Lock_State } from '../../shared/enums/vehicle';
import getter from './vehicleFunctions/getter';
import keys from './vehicleFunctions/keys';
import setter from './vehicleFunctions/setter';
import toggle from './vehicleFunctions/toggle';
import utility from './vehicleFunctions/utility';

/**
 * Overwrites the default functionality of vehicles.
 * Uses stream synced meta to fix vehicle controls.
 */

declare module 'alt-server' {
    export interface Vehicle {
        athenaLockState: Vehicle_Lock_State;
        engineStatus: boolean;
        keys: Array<string>;
        owner: number;
        fuel: number;
    }
}

export default function onLoad() {
    //
}

export const vehicleFuncs = {
    getter,
    setter,
    keys,
    toggle,
    utility
};
