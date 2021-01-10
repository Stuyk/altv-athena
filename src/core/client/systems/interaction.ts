import * as alt from 'alt-client';
import * as native from 'natives';
import { drawMarker } from '../utility/marker';
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
    if (!alt.Player.local.closestInteraction) {
        drawText2D('Looking for closest object...', { x: 0.5, y: 0.95 }, 0.3, new alt.RGBA(255, 255, 255, 200));
        return;
    } else {
        drawText2D(
            `Interaction ~y~(${alt.Player.local.closestInteraction.type})`,
            { x: 0.5, y: 0.95 },
            0.3,
            new alt.RGBA(255, 255, 255, 200)
        );
    }

    //const pos = { ...alt.Player.local.pos };
    //const close = { ...alt.Player.local.closestInteraction.position };
    drawMarker(1, alt.Player.local.closestInteraction.position, new alt.Vector3(1, 1, 1), new alt.RGBA(255, 0, 0, 100));
}
