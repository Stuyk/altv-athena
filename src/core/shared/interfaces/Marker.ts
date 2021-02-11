import { Vector3 } from 'alt-server';

export interface Marker {
    pos: Vector3;
    type: number;
    color: { r: number; g: number; b: number; a: number };
}
