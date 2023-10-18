import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { Door } from '@AthenaShared/interfaces/door.js';
import * as alt from 'alt-client';
import * as native from 'natives';

let doors: Array<Door> = [];
let interval: number;

/**
 * Do Not Export Internal Only
 */
const ClientDoorController = {
    init() {
        doors = [];
    },
    stop() {
        if (!interval) {
            return;
        }

        alt.clearInterval(interval);
    },
    populate(streamedDoors: Array<Door>) {
        doors = streamedDoors;

        if (!interval) {
            interval = alt.setInterval(handleDrawMarkers, alt.debug ? 0 : 500);
        }
    },
};

function handleDrawMarkers() {
    if (doors.length <= 0) {
        return;
    }

    for (let door of doors) {
        if (alt.debug) {
            const dist = AthenaClient.utility.vector.distance2d(alt.Player.local.pos, door.pos);
            if (dist > 5) {
                continue;
            }

            AthenaClient.screen.text.drawText3D(
                `UID: ${door.uid} - Unlocked: ${door.isUnlocked}`,
                door.pos,
                0.5,
                new alt.RGBA(255, 255, 255, 255),
            );
        }

        native.setStateOfClosestDoorOfType(door.model, door.pos.x, door.pos.y, door.pos.z, !door.isUnlocked, 0, false);
    }
}

alt.on('connectionComplete', ClientDoorController.init);
alt.on('disconnect', ClientDoorController.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_DOORS, ClientDoorController.populate);
