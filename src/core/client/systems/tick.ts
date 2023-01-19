import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Timer } from '@AthenaClient/utility/timers';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';

const pingEvery = 5000;

function startTick() {
    Timer.createInterval(handlePing, pingEvery, 'tick.ts');
}

/**
 * Pings the server every 5 minutes.
 */
function handlePing() {
    alt.emitServer(SYSTEM_EVENTS.PLAYER_TICK);
}

onTicksStart.add(startTick);
