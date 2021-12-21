import { Vector3 } from './vector';

export interface Particle {
    pos: Vector3;
    dict: string;
    name: string;
    duration: number;
    scale: number;
    delay?: number;
}
