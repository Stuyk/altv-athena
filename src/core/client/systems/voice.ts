import * as alt from 'alt-client';
import { System_Events_Voice } from '../../shared/enums/system';
import { drawText2D } from '../utility/text';

alt.onServer(System_Events_Voice.JoinedVoice, startTick);

/**
 * Displays if a player is talking locally on screen.
 * Temporary text for now.
 */
function startTick() {
    alt.setInterval(() => {
        if (alt.Player.local.isTalking) {
            drawText2D('Microphone On', { x: 0.5, y: 0.95 }, 0.4, new alt.RGBA(255, 255, 255, 255));
        }
    }, 0);
}
