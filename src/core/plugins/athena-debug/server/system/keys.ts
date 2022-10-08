import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { ATHENA_DEBUG_EVENTS } from '../../shared/events';

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

        const data = Athena.utility.deepCloneObject<LastStoredData>(lastStoredData);
        lastStoredData = undefined;
        return data;
    },
};

export const DebugKeys = {
    ...KeysConst,
};
