import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';

let timeoutId: number;

/**
 * Draw mission text on the bottom of screen
 * @param  {string} text
 * @param  {number} duration
 */
export function drawMissionText(text: string, duration: number | undefined = undefined) {
    if (timeoutId) {
        alt.setWatermarkPosition(0);
        alt.clearTimeout(timeoutId);
    }
    native.clearPrints();
    native.beginTextCommandPrint('STRING');
    native.addTextComponentSubstringPlayerName(text);
    if (typeof duration !== 'number') {
        duration = text.length * 100;
    }
    native.endTextCommandPrint(duration, true);
    timeoutId = alt.setTimeout(() => {
        alt.setWatermarkPosition(4);
        timeoutId = undefined;
    }, duration);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
