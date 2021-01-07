import * as alt from 'alt-client';
import * as native from 'natives';
import { drawText2D } from '../utility/text';

let tick: number;
let isOn: boolean = false;

export function toggleInteractionMode(): void {
    if (tick) {
        alt.clearInterval(tick);
        tick = null;
    }

    isOn = !isOn;
    if (!isOn) {
        return;
    }

    tick = alt.setInterval(handleInteractionMode, 0);
}

function handleInteractionMode() {
    drawText2D('Interacting', { x: 0.5, y: 0.95 }, 0.3, new alt.RGBA(255, 255, 255, 200));
}
