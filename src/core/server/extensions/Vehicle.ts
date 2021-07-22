import * as alt from 'alt-server';
import { Vehicle_Behavior } from '../../shared/enums/vehicle';
import * as IVeh from '../../shared/interfaces/Vehicle';
import getter from './vehicleFunctions/getter';
import keys from './vehicleFunctions/keys';
import newRef from './vehicleFunctions/new';
import save from './vehicleFunctions/save';
import setter from './vehicleFunctions/setter';
import utility from './vehicleFunctions/utility';

/**
 * Overwrites the default functionality of vehicles.
 * Uses stream synced meta to fix vehicle controls.
 */

declare module 'alt-server' {
    export interface Vehicle {
        keys?: Array<string>;
        fuel?: number;
        player_id?: number;
        behavior?: Vehicle_Behavior;
        data?: Partial<IVeh.Vehicle>; // Special Vehicle Information
        nextSave?: number;
        nextUpdate?: number;
        passengers?: Array<{ player: alt.Player; seat: number }>;
        isTemporary?: boolean;
    }
}

export const vehicleFuncs = {
    getter,
    setter,
    new: newRef,
    keys,
    save,
    utility
};
