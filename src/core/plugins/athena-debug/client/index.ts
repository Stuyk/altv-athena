import * as alt from 'alt-client';

import { ATHENA_DEBUG_EVENTS } from '../shared/events';
import { AthenaClient } from '@AthenaClient/api/athena';

const F1_KEY = 112;

function init() {
    alt.on('keyup', (key: number) => {
        if (key !== F1_KEY) {
            return;
        }

        alt.emitServer(ATHENA_DEBUG_EVENTS.ClientToServer.FORWARD);
    });
}

AthenaClient.events.onTicksStart.add(init);
