import * as alt from 'alt-client';

import * as AthenaClient from '@AthenaClient/api/index.js';
import { TextLabel } from '@AthenaShared/interfaces/textLabel.js';

let interval: number;
let textDraws: (TextLabel & { entity: alt.Entity })[] = [];

function draw() {
    if (alt.Player.local.isWheelMenuOpen) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    for (let textDraw of textDraws) {
        AthenaClient.screen.text.drawText3D(textDraw.text, textDraw.entity.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isTextLabel(entity)) {
        return;
    }

    if (!interval) {
        interval = alt.setInterval(draw, 0);
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = textDraws.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        textDraws[index] = { ...data, entity };
    } else {
        textDraws.push({ ...data, entity });
    }
}

function onStreamExit(entity: alt.Object) {
    if (!isTextLabel(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    for (let i = textDraws.length - 1; i >= 0; i--) {
        if (textDraws[i].uid !== data.uid) {
            continue;
        }

        textDraws.splice(i, 1);
    }

    if (textDraws.length <= 0) {
        alt.clearInterval(interval);
        interval = undefined;
    }
}

function onStreamSyncedMetaChanged(entity: alt.Object, key: string, value: any) {
    if (!isTextLabel(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = textDraws.findIndex((x) => x.uid === data.uid);
    if (index <= -1) {
        return;
    }

    textDraws[index] = { ...data, entity };
}

function getData(object: alt.Object): TextLabel {
    return object.getStreamSyncedMeta('label') as TextLabel;
}

function isTextLabel(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === 'textlabel';
}

alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
