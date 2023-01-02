import * as alt from 'alt-shared';
import { VEHICLE_TYPE } from '@AthenaShared/enums/vehicleTypeFlags';

export default interface IGarage {
    position: alt.IVector3;
    type: VEHICLE_TYPE;
    index: string | number;
    parking: Array<{ position: alt.IVector3; rotation: alt.IVector3 }>;
}
