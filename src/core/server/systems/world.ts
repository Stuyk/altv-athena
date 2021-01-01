import * as alt from 'alt-server';
import { System_Events_World } from '../../shared/enums/system';

alt.setInterval(handleWorldTime, 60000);

const BOOTUP_HOUR = 9;
const BOOTUP_MINUTE = 0;
const MINUTES_PER_MINUTE = 5;

const GlobalTime = {
    hour: BOOTUP_HOUR,
    minute: BOOTUP_MINUTE
};

function handleWorldTime() {
    GlobalTime.minute += MINUTES_PER_MINUTE;
    if (GlobalTime.minute >= 60) {
        GlobalTime.minute = 0;
        GlobalTime.hour += 1;
    }

    if (GlobalTime.hour >= 24) {
        GlobalTime.hour = 0;
    }

    alt.emitClient(null, System_Events_World.UpdateTime, GlobalTime.hour, GlobalTime.minute);
}

export function updatePlayerTime(player: alt.Player): void {
    alt.emitClient(player, System_Events_World.UpdateTime, GlobalTime.hour, GlobalTime.minute);
}
