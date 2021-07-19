import { VEHICLE_CLASS } from '../flags/vehicleType';
import { Vector3 } from './Vector';

export interface Dealership {
    name: string;
    position: Vector3;
    vehiclePosition: Vector3;
    vehicleHeading: number;
    vehiclePreview: string;
    class: VEHICLE_CLASS;
    stock: number;
    createBlip?: boolean;
}
