import { Vector3 } from 'alt-client';
import { AnimationFlags } from '../flags/animation';

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
