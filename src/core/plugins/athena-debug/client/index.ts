import * as alt from 'alt-client';

import { ATHENA_DEBUG_EVENTS } from '../shared/events';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';

const F1_KEY = 112;

function init() {
    if (!alt.debug) {
        return;
    }

    alt.on('keyup', (key: number) => {
        if (key !== F1_KEY) {
            return;
        }

        alt.emitServer(ATHENA_DEBUG_EVENTS.ClientToServer.FORWARD);
    });
}

onTicksStart.add(init);
