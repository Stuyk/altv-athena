import * as alt from 'alt-shared';

export interface IStreamConfig {
    /**
     * How often the interval will update players.
     * @type {number}
     *
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
    pos: alt.IVector3;
    dimension?: number;
}
