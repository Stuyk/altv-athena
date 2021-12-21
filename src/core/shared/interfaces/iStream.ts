import { IObject } from './iObject';
import { Marker } from './marker';
import { TextLabel } from './textLabel';
import { Vector3 } from './vector';
import { IPed } from './iPed';

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
