import { Vector3 } from './Vector';

export interface TextLabel {
    pos: Vector3;
    data: string;
    maxDistance?: number;
    uid?: string;
}
