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

    /**
     * The distance which players should see markers.
     * @type {number}
     * @memberof IStreamConfig
     */
    MarkersDistance: number;

    /**
     * The distance which players can see text labels.
     * @type {number}
     * @memberof IStreamConfig
     */
    LabelsDistance: number;

    /**
     * The distance which players can see objects.
     * @type {number}
     * @memberof IStreamConfig
     */
    ObjectsDistance: number;

    /**
     * The distance which players can see static peds.
     * @type {number}
     * @memberof IStreamConfig
     */
    PedsDistance: number;
}

export interface IStream {
    id?: number;
    labels: Array<TextLabel>;
    markers: Array<Marker>;
    objects: Array<IObject>;
    peds: Array<IPed>;
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
    dimension: number;
}
