import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { loadSceneAtCoords } from './scene';

class Getters {
    static async waypoint(callbackName: string) {
        let startingZPosition = 0;

        for (let i = 0; i < 100; i++) {
            const waypoint = native.getFirstBlipInfoId(8);
            const coords = native.getBlipInfoIdCoord(waypoint);

            await loadSceneAtCoords(coords);
            native.requestCollisionAtCoord(coords.x, coords.y, coords.z);
            native.setFocusPosAndVel(coords.x, coords.y, startingZPosition, 0, 0, 0);

            const [isValid, zPos] = native.getGroundZFor3dCoord(coords.x, coords.y, startingZPosition, 0, false, false);
            if (!isValid) {
                startingZPosition += 25;
                continue;
            }

            const newPos = { x: coords.x, y: coords.y, z: zPos };
            alt.emitServer(callbackName, newPos);
            native.clearFocus();
            return;
        }

        native.requestCollisionAtCoord(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z);
        alt.emitServer(callbackName, null);
        native.clearFocus();
    }
}

alt.onServer(SYSTEM_EVENTS.GET_WAYPOINT, Getters.waypoint);
