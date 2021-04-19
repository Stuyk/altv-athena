import { Vector3 } from './Vector';

export interface Furniture {
    pos: Vector3;
    rot: Vector3;
    hash: string;
}

export interface Interior {
    _id?: any;
    outside: Vector3;
    inside: Vector3;
    name: string;
    forSale?: boolean;
    dimension?: number;
    lockStatus?: boolean;
    friends?: Array<string>;
    factions?: Array<string>;
    mlos?: Array<string>;
    furniture?: Array<Furniture>;
}
