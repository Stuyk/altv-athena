import * as alt from 'alt-server';

import { Vehicle_Behavior } from '../../shared/enums/vehicle';
import { IVehicle } from '../../shared/interfaces/IVehicle';

declare module 'alt-server' {
    export interface Vehicle {
        keys?: Array<string>;
        player_id?: number;
        behavior?: Vehicle_Behavior;
        data?: IVehicle; // Special Vehicle Information
        nextSave?: number;
        nextUpdate?: number;
        passengers?: Array<{ player: alt.Player; seat: number }>;
        isTemporary?: boolean;
    }
}
