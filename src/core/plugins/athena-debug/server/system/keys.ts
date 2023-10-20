import * as alt from 'alt-server';

import { ATHENA_DEBUG_EVENTS } from '../../shared/events.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';

interface LastStoredData {
    pos: alt.IVector3;
    rot: alt.IVector3;
}

let lastStoredData: LastStoredData;

const KeysConst = {
    init() {
        alt.onClient(ATHENA_DEBUG_EVENTS.ClientToServer.FORWARD, KeysConst.flagPosition);
    },
    flagPosition(player: alt.Player) {
        lastStoredData = {
            pos: player.pos,
            rot: player.rot,
        };
    },
    getLastPosition(): LastStoredData {
        if (!lastStoredData) {
            return undefined;
        }

        const data = deepCloneObject<LastStoredData>(lastStoredData);
        lastStoredData = undefined;
        return data;
    },
};

export const DebugKeys = {
    ...KeysConst,
};
