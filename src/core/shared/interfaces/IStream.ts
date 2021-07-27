import { Marker } from './Marker';
import { TextLabel } from './TextLabel';
import { Vector3 } from './Vector';

export interface IStream {
    id?: number;
    labels: Array<TextLabel>;
    markers: Array<Marker>;
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
