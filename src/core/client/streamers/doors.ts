import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { AthenaClient } from '@AthenaClient/api/athena';
import { Door } from '@AthenaShared/interfaces/door';
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

        AthenaClient.timer.clearInterval(interval);
    },
    populate(streamedDoors: Array<Door>) {
        doors = streamedDoors;

        if (!interval) {
            interval = AthenaClient.timer.createInterval(
                handleDrawMarkers,
                alt.debug ? 0 : 500,
                'client/streamers/doors.ts',
            );
        }
    },
};

function handleDrawMarkers() {
    if (doors.length <= 0) {
        return;
    }

    for (let door of doors) {
        if (alt.debug) {
            const dist = AthenaClient.utility.distance2D(alt.Player.local.pos, door.pos);
            if (dist > 5) {
                continue;
            }

            AthenaClient.screen.drawText3D(
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
