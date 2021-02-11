import { Vector3 } from './Vector';

export interface Particle {
    pos: Vector3;
    dict: string;
    name: string;
    duration: number;
    scale: number;
    delay?: number;
}
