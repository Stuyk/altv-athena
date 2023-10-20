import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';

const pingEvery = 5000;

function startTick() {
    alt.setInterval(handlePing, pingEvery);
}

/**
 * Pings the server every 5 minutes.
 */
function handlePing() {
    alt.emitServer(SYSTEM_EVENTS.PLAYER_TICK);
}

onTicksStart.add(startTick);
