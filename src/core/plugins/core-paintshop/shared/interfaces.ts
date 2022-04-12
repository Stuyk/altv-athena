import { RGB } from '../../../shared/interfaces/rgb';
import { Vector3 } from '../../../shared/interfaces/vector';

export interface iPaintshopSync {
    color: number | RGB;
    color2: number | RGB;
    pearl: number;
    finish1: number;
    finish2: number;
}

export interface IPaintShop {
    uid: string;
    cost: number;
    vertices: Array<Vector3>;
}
