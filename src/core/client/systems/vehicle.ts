import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';
import { distance, getClosestVectorByPos } from '../../shared/utility/vector';
import { DoorData } from '../extensions/Vehicle';
import { drawText3D } from '../utility/text';

const TOGGLE_LOCK_MESSAGE = `X - Toggle Lock`;
const TOGGLE_ENTER_MESSAGE = `F - Enter`;

const maxDistance = 5;
let nextVehicleCheck: number = Date.now();
let timeBetweenControls: number = Date.now();
let interval: number;
let vehicles: alt.Vehicle[];

alt.onServer(Events_Misc.StartTicks, startTick);

function startTick() {
    interval = alt.setInterval(handleInterval, 0);
}

function handleInterval() {
    native.disableControlAction(0, 23, true); // F
    native.disableControlAction(0, 75, true); // F
    native.disableControlAction(0, 104, true); // H

    // Disable default vehicle behavior.
    if (native.isPedTryingToEnterALockedVehicle(alt.Player.local.scriptID)) {
        native.clearPedTasks(alt.Player.local.scriptID);
        native.clearPedSecondaryTask(alt.Player.local.scriptID);
    }

    // Handles Exiting a Vehicle
    if (alt.Player.local.vehicle) {
        if (!native.isDisabledControlJustReleased(0, 23) || Date.now() < timeBetweenControls) {
            return;
        }

        timeBetweenControls = Date.now() + 1000;
        native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
        return;
    }

    // Update Closest Vehicles
    if (Date.now() > nextVehicleCheck) {
        nextVehicleCheck = Date.now() + 2500;
        vehicles = [...alt.Vehicle.all].filter((vehicle) => {
            return distance(alt.Player.local.pos, vehicle.pos) <= maxDistance;
        });
    }

    if (vehicles.length <= 0) {
        return;
    }

    // Get the closest vehicle based on vehicles.
    const closestVehicle: alt.Vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, vehicles);
    if (!closestVehicle) {
        return;
    }

    // Check if the vehicle is locked *server-side*
    const locked: boolean = closestVehicle.getStreamSyncedMeta('locked');
    if (locked) {
        drawText3D(TOGGLE_LOCK_MESSAGE, closestVehicle.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
        return;
    }

    // Get the closest Door.
    const closestDoor: DoorData = closestVehicle.getClosestDoor(alt.Player.local.pos);
    drawText3D(TOGGLE_ENTER_MESSAGE, closestDoor.pos, 0.4, new alt.RGBA(255, 255, 255, 255));

    if (!native.isDisabledControlJustReleased(0, 23) || Date.now() < timeBetweenControls) {
        return;
    }

    timeBetweenControls = Date.now() + 1000;

    if (closestDoor.isDoor) {
        closestVehicle.toggleDoor(closestDoor.seat);
        return;
    }

    native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, closestDoor.seat, 2, 1, 0);
}
