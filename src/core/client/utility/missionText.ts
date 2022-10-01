import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
/**
 * Draw mission text on the bottom of screen
 * @param  {string} text
 * @param  {number} duration

 */
export function drawMissionText(text: string, duration: number | undefined = undefined) {
    native.clearPrints();
    native.beginTextCommandPrint('STRING');
    native.addTextComponentSubstringPlayerName(text);
    if (typeof duration !== 'number') {
        duration = text.length * 100;
    }
    native.endTextCommandPrint(duration, true);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
