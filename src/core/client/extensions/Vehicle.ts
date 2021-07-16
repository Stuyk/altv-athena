import * as alt from 'alt-client';
import { Vector3 } from 'alt-client';

import play from './vehicleFuncs/play';
import sync from './vehicleFuncs/sync';
import toggle from './vehicleFuncs/toggle';

alt.on('gameEntityCreate', handleEntityCreation);
alt.on('streamSyncedMetaChange', handleSyncedMetaChange);

export interface DoorData {
    pos: Vector3;
    seat: number;
    isDoor?: boolean;
}

declare module 'alt-client' {
    export interface Vehicle {
        doorStates: { [doorNumber: number]: boolean };
        owner: number;
        fuel: number;
    }
}

function handleSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any): void {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    alt.setTimeout(() => {
        sync.update(entity);
    }, 250);
}

function handleEntityCreation(entity: alt.Entity): void {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    alt.setTimeout(() => {
        alt.emit('vehicle:Created', entity);
        sync.update(entity);
    }, 250);
}

export default {
    play,
    sync,
    toggle
};
