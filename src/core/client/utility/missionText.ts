import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
/**
 * Draw mission text on the bottom of screen
 * @param  {string} text

 */
export function drawMissionText(text: string) {
    native.clearPrints();
    native.beginTextCommandPrint('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandPrint(100 * text.length, true);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_MISSION_TEXT, drawMissionText);
