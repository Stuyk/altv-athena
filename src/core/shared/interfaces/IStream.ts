import { IObject } from './IObject';
import { Marker } from './Marker';
import { TextLabel } from './TextLabel';
import { Vector3 } from './Vector';

export interface IStreamConfig {
    /**
     * How often the interval will update players.
     * @type {number}
     * @memberof IStreamConfig
     */
    TimeBetweenUpdates: number;

    MarkersDistance: number;
    LabelsDistance: number;
    ObjectsDistance: number;
}

export interface IStream {
    id?: number;
    labels: Array<TextLabel>;
    markers: Array<Marker>;
    objects: Array<IObject>;
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
}
