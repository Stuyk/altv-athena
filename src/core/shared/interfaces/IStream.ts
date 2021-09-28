import { IObject } from './IObject';
import { Marker } from './Marker';
import { TextLabel } from './TextLabel';
import { Vector3 } from './Vector';
import { IPed } from './IPed';

export interface IStreamConfig {
    /**
     * How often the interval will update players.
     * @type {number}
     * @memberof IStreamConfig
     */
    TimeBetweenUpdates: number;
}

export interface IStream {
    id?: number;
}

export interface IStreamMessage {
    id: number;
    route: string;
    data: any;
}

export interface IStreamPopulate<T> {
    key: string;
    array: Array<T>;
}

export interface IStreamUpdate {
    pos: Vector3;
    dimension?: number;
}
