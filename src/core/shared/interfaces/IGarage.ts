import { VEHICLE_TYPE } from '../enums/VehicleTypeFlags';
import { Vector3 } from './Vector';

export default interface IGarage {
    position: Vector3;
    type: VEHICLE_TYPE;
    parking: Array<{ position: Vector3; rotation: Vector3 }>;
}
