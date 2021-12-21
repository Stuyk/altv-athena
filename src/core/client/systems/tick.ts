import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Timer } from '../utility/timers';

const pingEvery = 5000;

alt.onServer(SYSTEM_EVENTS.TICKS_START, startTick);

function startTick() {
    Timer.createInterval(handlePing, pingEvery, 'tick.ts');
}

/**
 * Pings the server every 5 minutes.
 */
function handlePing() {
    alt.emitServer(SYSTEM_EVENTS.PLAYER_TICK);
}
