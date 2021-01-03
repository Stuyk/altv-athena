import * as alt from 'alt-client';
import { System_Events_Voice } from '../../shared/enums/system';
import { drawText2D } from '../utility/text';

alt.onServer(System_Events_Voice.JoinedVoice, startTick);

function startTick() {
    alt.setInterval(() => {
        alt.log(`${alt.Player.local.isTalking}`);

        if (alt.Player.local.isTalking) {
            drawText2D('YOU ARE TALKING', { x: 0.5, y: 0.95 }, 0.5, new alt.RGBA(255, 255, 255, 255));
        }
    }, 0);
}
