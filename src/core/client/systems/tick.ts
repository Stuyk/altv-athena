import * as alt from 'alt-client';
import { Events_Misc } from '../../shared/enums/events';

const pingEvery = 5000;

alt.onServer(Events_Misc.StartTicks, startTick);

function startTick() {
    alt.setInterval(handlePing, pingEvery);
}

function handlePing() {
    alt.emitServer(Events_Misc.Ping);
}
