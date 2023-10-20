import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import * as alt from 'alt-client';
import * as native from 'natives';

function setTime(hour: number, minute: number) {
    native.pauseClock(false);
    if (hour >= 24) {
        hour = 23;
    }

    native.setClockTime(hour, minute, 0);
    native.pauseClock(true);
}

alt.onServer(SYSTEM_EVENTS.SET_GAME_TIME, setTime);
