import { AnimationFlags } from '../flags/animation';

export interface Animation {
    dict: string;
    name: string;
    flags: AnimationFlags;
    duration: number;
}
