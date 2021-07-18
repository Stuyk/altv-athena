import { Vector3 } from './Vector';

export interface Help {
    position: Vector3;
    key?: number | null;
    desc?: string | null;
    expiration?: number;
}
