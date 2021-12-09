import * as alt from 'alt-server';
import { IStreamPolygon } from '../../shared/interfaces/IStreamPolygon';
import { playerFuncs } from '../extensions/Player';
import { ServerPolygonController } from '../streamers/polygon';

// Does nothing. Just writing some code here.
// May change from version to version but it's mostly just Stuyk's notepad.

function enter<T>(player: alt.Player | T, stream: IStreamPolygon) {
    if (!(player instanceof alt.Player)) {
        return;
    }

    playerFuncs.emit.message(player, `Entered the Polygon`);
}

function leave<T>(player: alt.Player | T, stream: IStreamPolygon) {
    if (!(player instanceof alt.Player)) {
        return;
    }

    playerFuncs.emit.message(player, `Left the Polygon`);
}

function polygonTester() {
    const testPolygon: IStreamPolygon = {
        pos: { x: 0, y: 0, z: 0 },
        vertices: [],
        debug: true,
        maxY: 3,
        enterEventCall: enter,
        leaveEventCall: leave,
    };

    ServerPolygonController.append(testPolygon);
}
