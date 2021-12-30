import * as alt from 'alt-client';
import * as native from 'natives';
import { ATHENA_EVENTS_PLAYER_CLIENT } from '../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vector3 } from '../../shared/interfaces/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { loadSceneAtCoords } from '../utility/scene';
import { Timer } from '../utility/timers';

let interval: number;
let isUpdatingWaypoint = false;
let lastWaypointData: Vector3;

export class AthenaEvents {
    static init() {
        if (interval) {
            Timer.clearInterval(interval);
            interval = null;
        }

        interval = Timer.createInterval(AthenaEvents.tick, 250, 'athenaEvents.ts');
    }

    /**
     * Sends an event to the server when the local player's waypoint is updated.
     * @static
     * @return {*}
     * @memberof AthenaEvents
     */
    static async updateWaypoint() {
        if (isUpdatingWaypoint) {
            return;
        }

        isUpdatingWaypoint = true;
        const waypoint = native.getFirstBlipInfoId(8);

        // Does Not Exist
        if (!native.doesBlipExist(waypoint)) {
            // Prevent emitting the data twice.
            if (lastWaypointData !== null) {
                lastWaypointData = null;
                alt.emitServer(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, null);
            }

            isUpdatingWaypoint = false;
            return;
        }

        const coords = native.getBlipInfoIdCoord(waypoint);

        if (!coords) {
            // Prevent emitting the data twice.
            if (lastWaypointData !== null) {
                lastWaypointData = null;
                alt.emitServer(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, null);
            }

            isUpdatingWaypoint = false;
            return;
        }

        // Same data don't use it.
        if (lastWaypointData && lastWaypointData.x === coords.x && lastWaypointData.y === coords.y) {
            isUpdatingWaypoint = false;
            return;
        }

        const foundWaypoint: Vector3 = await new Promise(async (resolve: Function) => {
            let startingZPosition = 0;

            for (let i = 0; i < 100; i++) {
                await loadSceneAtCoords(coords);
                native.requestCollisionAtCoord(coords.x, coords.y, coords.z);
                native.setFocusPosAndVel(coords.x, coords.y, startingZPosition, 0, 0, 0);

                const [isValid, zPos] = native.getGroundZFor3dCoord(
                    coords.x,
                    coords.y,
                    startingZPosition,
                    0,
                    false,
                    false,
                );

                if (!isValid) {
                    startingZPosition += 25;
                    continue;
                }

                if (startingZPosition >= 1500) {
                    resolve(null);
                    return;
                }

                native.requestCollisionAtCoord(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z);
                native.clearFocus();

                // Found the ground position
                resolve({ x: coords.x, y: coords.y, z: zPos });
                return;
            }
        });

        // Did not find the ground position
        lastWaypointData = foundWaypoint;
        alt.emitServer(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, foundWaypoint);
        native.requestCollisionAtCoord(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z);
        native.clearFocus();
        isUpdatingWaypoint = false;
    }

    static tick() {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!isUpdatingWaypoint) {
            AthenaEvents.updateWaypoint();
        }
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, AthenaEvents.init);
