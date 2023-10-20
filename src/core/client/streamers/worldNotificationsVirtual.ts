import { IWorldNotification } from '@AthenaShared/interfaces/iWorldNotification.js';
import * as alt from 'alt-client';
import * as native from 'natives';

let interval: number;
let worldNotifications: (IWorldNotification & { entity: alt.Entity })[] = [];

function draw() {
    if (alt.Player.local.isWheelMenuOpen) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    for (let notification of worldNotifications) {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(notification.text);
        native.endTextCommandDisplayHelp(2, false, false, -1);
        native.setFloatingHelpTextWorldPosition(1, notification.pos.x, notification.pos.y, notification.pos.z);

        if (notification.background === null || notification.background === undefined) {
            notification.background = 2;
        }

        native.setFloatingHelpTextStyle(1, 1, notification.background, -1, notification.type, 0);
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isWorldNotification(entity)) {
        return;
    }

    if (!interval) {
        interval = alt.setInterval(draw, 0);
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = worldNotifications.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        worldNotifications[index] = { ...data, entity };
    } else {
        worldNotifications.push({ ...data, entity });
    }
}

function onStreamExit(entity: alt.Object) {
    if (!isWorldNotification(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    for (let i = worldNotifications.length - 1; i >= 0; i--) {
        if (worldNotifications[i].uid !== data.uid) {
            continue;
        }

        worldNotifications.splice(i, 1);
    }

    if (worldNotifications.length <= 0) {
        alt.clearInterval(interval);
        interval = undefined;
    }
}

function onStreamSyncedMetaChanged(entity: alt.Object, key: string, value: any) {
    if (!isWorldNotification(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = worldNotifications.findIndex((x) => x.uid === data.uid);
    if (index <= -1) {
        return;
    }

    worldNotifications[index] = { ...data, entity };
}

function getData(object: alt.Object): IWorldNotification {
    return object.getStreamSyncedMeta('notification') as IWorldNotification;
}

function isWorldNotification(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === 'worldnotification';
}

alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
