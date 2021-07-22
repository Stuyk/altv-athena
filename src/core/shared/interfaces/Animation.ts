import { AnimationFlags } from '../flags/animation';
import { Vector3 } from './Vector';

export interface Animation {
    dict: string;
    name: string;
    flags: AnimationFlags;
    duration: number;
}

export interface JobAnimation extends Animation {
    delay?: number;
    atObjectiveStart?: boolean;
    rotation?: Vector3;
}
