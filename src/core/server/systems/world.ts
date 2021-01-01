import * as alt from 'alt-server';
import { System_Events_World } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';

alt.setInterval(handleWorldTime, 60000);

const GlobalTime = {
    hour: DEFAULT_CONFIG.BOOTUP_HOUR,
    minute: DEFAULT_CONFIG.BOOTUP_MINUTE
};

function handleWorldTime() {
    GlobalTime.minute += DEFAULT_CONFIG.MINUTES_PER_MINUTE;
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
