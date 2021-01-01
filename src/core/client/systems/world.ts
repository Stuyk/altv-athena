import { System_Events_World } from '../../shared/enums/system';
import * as alt from 'alt-client';
import * as native from 'natives';

let hasPausedClock = false;
let currentTime = {
    hour: 0,
    minute: 0
};

alt.onServer(System_Events_World.UpdateTime, handleUpdateTime);
alt.on('debug:Time', getTime);

function handleUpdateTime(hour: number, minute: number): void {
    if (!hasPausedClock) {
        hasPausedClock = true;
        native.pauseClock(true);
    }

    currentTime.hour = hour;
    currentTime.minute = minute;

    native.setClockTime(hour, minute, 0);
}

function getTime() {
    alt.log(`Time: ${currentTime.hour}:${currentTime.minute}:00`);
}
