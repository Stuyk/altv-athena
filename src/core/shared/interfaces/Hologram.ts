import { Vector3 } from './Vector';

export interface Hologram {
    identifier: string;
    model: string;
    position: Vector3;
    heading: number;
    noMaxDistance?: boolean;
    isHidden?: boolean;
    clientRef?: number;
}
