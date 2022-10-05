import * as alt from 'alt-client';
import * as natives from 'natives';
import { AthenaClient } from '../../../client/api/athena';
import { JOB_VEHICLE_REPO_EVENTS } from '../shared/events';

let everyTickId: number;

/**
 * Add a subtitle that stay forever.
 * Pass a vehicle model string to format to the vehicle name.
 */
function setObjective(text: string, vehicleModel?: string | number, position?: alt.Vector3) {
    if (vehicleModel) {
        const hash = typeof vehicleModel === 'string' ? alt.hash(vehicleModel) : vehicleModel;
        text = text.replace('[vehicle_name]', natives.getDisplayNameFromVehicleModel(hash));
    }
    if (position) {
        const streetHash = natives.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0);
        text = text.replace('[street_name]', natives.getStreetNameFromHashKey(streetHash[1]));
    }
    if (everyTickId) {
        alt.clearEveryTick(everyTickId);
    }
    everyTickId = alt.everyTick(() => {
        AthenaClient.utility.drawMissionText(text, 100);
    });
}

/**
 * Unset the subtitle
 */
function unsetObjective() {
    if (everyTickId) {
        alt.clearEveryTick(everyTickId);
        everyTickId = undefined;
    }
}

/**
 * Handle job complete on client
 */
function jobCompleted() {
    const player = alt.Player.local;
    if (player && player.valid && player.vehicle) {
        natives.taskLeaveAnyVehicle(player, 0, 0);
    }
}

alt.onServer(JOB_VEHICLE_REPO_EVENTS.SET_OBJECTIVE, setObjective);
alt.onServer(JOB_VEHICLE_REPO_EVENTS.UNSET_OBJECTIVE, unsetObjective);
alt.onServer(JOB_VEHICLE_REPO_EVENTS.JOB_COMPLETED, jobCompleted);
