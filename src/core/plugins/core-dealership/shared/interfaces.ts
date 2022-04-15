import * as alt from 'alt-shared';
import { VehicleInfo } from '../../../shared/interfaces/vehicleInfo';

export interface IDealership {
    uid: string;
    pos: alt.IVector3;
    cam: alt.IVector3;
    vehiclePosition: alt.IVector3;
    vehicles: Array<VehicleInfo>;
}
