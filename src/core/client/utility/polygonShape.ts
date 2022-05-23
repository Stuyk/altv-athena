import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vector2 } from '../../shared/interfaces/vector';

const drawables: { [uid: string]: Array<Vector2> } = {};
let interval: number | undefined;

function drawTick() {
    Object.keys(drawables).forEach((key) => {
        const drawLines: Array<{ a: Vector2; b: Vector2 }> = [];

        for (let i = 0; i < drawables[key].length; i++) {
            // Last Line
            if (i === drawables[key].length - 1) {
                drawLines.push({ a: drawables[key][i], b: drawables[key][0] });
                continue;
            }

            // Rest of the Lines
            drawLines.push({ a: drawables[key][i], b: drawables[key][i + 1] });
        }

        for (let i = 0; i < drawLines.length; i++) {
            const a = drawLines[i].a;
            const b = drawLines[i].b;
            native.drawLine(a.x, a.y, alt.Player.local.pos.z, b.x, b.y, alt.Player.local.pos.z, 255, 0, 0, 255);
        }
    });
}

alt.onServer(SYSTEM_EVENTS.DEBUG_COLSHAPE_VERTICES, (uid: string, vertices: Array<Vector2>) => {
    drawables[uid] = vertices;
    interval = alt.setInterval(drawTick, 0);
});
