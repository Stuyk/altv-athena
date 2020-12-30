import * as alt from 'alt-server';
import { Events_Meta } from '../../../shared/enums/meta';

export function emitPrototype(eventName: string, ...args: any[]) {
    alt.nextTick(() => {
        alt.emitClient(this, eventName, ...args);
    });
}

export function emitMetaPrototype(key: string, value: any) {
    alt.nextTick(() => {
        alt.emitClient(this, Events_Meta.Set, key, value);
    });
}
