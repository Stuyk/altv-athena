import { VEHICLE_TYPE } from '../enums/vehicleTypeFlags';
import { Vector3 } from './vector';

export default interface IGarage {
    position: Vector3;
    type: VEHICLE_TYPE;
    index: string | number;
    parking: Array<{ position: Vector3; rotation: Vector3 }>;
}
