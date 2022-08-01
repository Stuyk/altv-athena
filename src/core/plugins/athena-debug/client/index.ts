import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { ATHENA_DEBUG_EVENTS } from '../shared/events';

alt.onServer(SYSTEM_EVENTS.TICKS_START, () => {
    alt.on('keyup', (key: number) => {
        if (key !== 112) {
            return;
        }

        alt.emitServer(ATHENA_DEBUG_EVENTS.ClientToServer.FORWARD);
    });
});
