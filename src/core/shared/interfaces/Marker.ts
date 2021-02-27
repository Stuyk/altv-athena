import { Vector3 } from './Vector';

export interface Marker {
    pos: Vector3;
    type: number;
    color: { r: number; g: number; b: number; a: number };
    scale?: Vector3;
    maxDistance?: number;
    uid?: string;
}
