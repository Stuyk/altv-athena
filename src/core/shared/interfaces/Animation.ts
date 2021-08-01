import { ANIMATION_FLAGS } from '../flags/AnimationFlags';
import { Vector3 } from './Vector';

export interface Animation {
    dict: string;
    name: string;
    flags: ANIMATION_FLAGS;
    duration: number;
}

export interface JobAnimation extends Animation {
    delay?: number;
    atObjectiveStart?: boolean;
    rotation?: Vector3;
}
