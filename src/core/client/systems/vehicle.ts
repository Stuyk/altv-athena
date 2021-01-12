import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';
import {
    Vehicle_Events,
    Vehicle_Lock_State,
    Vehicle_State,
    inLockedState,
    Vehicle_Seat_List
} from '../../shared/enums/vehicle';
import { distance, getClosestVectorByPos } from '../../shared/utility/vector';
import { DoorData } from '../extensions/Vehicle';
import { drawText3D } from '../utility/text';

alt.onServer(Vehicle_Events.SET_INTO, handleSetInto);
alt.onServer(Events_Misc.StartTicks, startTick);
alt.on('streamSyncedMetaChange', handleVehicleDataChange);

const TIME_BETWEEN_CONTROL_PRESS = 1000;
const TIME_BETWEEN_CHECKS = 1500;
const TOGGLE_LOCK_MESSAGE = `X - Toggle Lock`;
const MAX_VEHICLE_DISTANCE = 5;

let nextVehicleCheck: number = Date.now();
let timeBetweenControls: number = Date.now();
let interval: number;
let vehicles: alt.Vehicle[];
let pressedLockKey = false;
let pressedVehicleFunction = false;

export function triggerVehicleLock(): void {
    pressedLockKey = true;
}

export function triggerVehicleFunction(): void {
    pressedVehicleFunction = true;
}

function startTick() {
    interval = alt.setInterval(handleInterval, 0);
}

function updateClosestVehicles(): void {
    if (Date.now() > nextVehicleCheck) {
        nextVehicleCheck = Date.now() + TIME_BETWEEN_CHECKS;
        vehicles = [...alt.Vehicle.all].filter((vehicle) => {
            return distance(alt.Player.local.pos, vehicle.pos) <= MAX_VEHICLE_DISTANCE;
        });
    }
}

function handleInVehicle(): void {
    if (!pressedVehicleFunction || Date.now() < timeBetweenControls) {
        return;
    }

    pressedVehicleFunction = false;

    // Prevent a player from leaving the vehicle if in kidnap mode.
    const lock: Vehicle_Lock_State = alt.Player.local.vehicle.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);
    if (Vehicle_Lock_State.KIDNAP_MODE === lock) {
        return;
    }

    timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
    native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
    return;
}

function handleOutOfVehicle(): void {
    const closestVehicle: alt.Vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, vehicles);

    // Get the closest vehicle based on vehicles.
    if (!closestVehicle) {
        return;
    }

    // Check if the vehicle is locked *server-side*
    // Handles the 'X' key press to try and toggle lock.
    if (pressedLockKey && Date.now() > timeBetweenControls) {
        pressedLockKey = false;
        timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
        alt.emitServer(Vehicle_Events.SET_LOCK, closestVehicle);
        return;
    }

    const lock: Vehicle_Lock_State = closestVehicle.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);
    if (inLockedState(lock)) {
        drawText3D(`${Vehicle_Lock_State[lock]}`, closestVehicle.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
        return;
    }

    if (!pressedVehicleFunction) {
        return;
    }

    pressedVehicleFunction = false;

    // // Get the closest Door.
    // const vehClass = native.getVehicleClass(closestVehicle.scriptID);
    // const isBike = vehClass === 8 || vehClass === 13 ? true : false;

    // let closestDoor: DoorData;
    // if (!isBike) {
    //     closestDoor = closestVehicle.getClosestDoor(alt.Player.local.pos);
    // }

    // if (!native.isDisabledControlJustReleased(0, 23) || Date.now() < timeBetweenControls) {
    //     return;
    // }

    // timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;

    // if (isBike) {
    //     const isDriverFree = native.isVehicleSeatFree(closestVehicle.scriptID, -1, false);
    //     if (isDriverFree) {
    //         native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, -1, 2, 1, 0);
    //         return;
    //     }

    //     const isPassengerFree = native.isVehicleSeatFree(closestVehicle.scriptID, 0, false);
    //     if (isPassengerFree) {
    //         native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, 0, 2, 1, 0);
    //         return;
    //     }
    //     return;
    // }

    // if (closestDoor.isDoor) {
    //     closestVehicle.toggleDoor(closestDoor.seat);
    //     return;
    // }

    // native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, closestDoor.seat, 2, 1, 0);
    native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, -1, 2, 1, 0);
}

function handleInterval() {
    if (alt.Player.local.isMenuOpen) {
        pressedLockKey = false;
        pressedVehicleFunction = false;
        return;
    }

    // Disable Default Controls
    native.disableControlAction(0, 23, true); // F
    native.disableControlAction(0, 75, true); // F
    native.disableControlAction(0, 104, true); // H

    // Disable default vehicle behavior.
    if (native.isPedTryingToEnterALockedVehicle(alt.Player.local.scriptID)) {
        native.clearPedTasks(alt.Player.local.scriptID);
        native.clearPedSecondaryTask(alt.Player.local.scriptID);
    }

    // Update closest vehicles. Then check if list is empty.
    updateClosestVehicles();
    if (vehicles.length <= 0) {
        pressedLockKey = false;
        pressedVehicleFunction = false;
        return;
    }

    // Handles Exiting a Vehicle
    // Return if they're exiting the vehicle or not.
    // Handles in-vehicle functionality.
    if (alt.Player.local.vehicle) {
        handleInVehicle();
        return;
    }

    handleOutOfVehicle();
}

async function hasVehicleLoaded(vehicle: alt.Vehicle, count: number = 0): Promise<boolean> {
    count += 1;
    if (count >= 25) {
        return false;
    }

    if (!vehicle) {
        return false;
    }

    if (!vehicle.valid) {
        return await hasVehicleLoaded(vehicle, count);
    }

    return true;
}

async function handleSetInto(vehicle: alt.Vehicle, seat: Vehicle_Seat_List) {
    const isLoaded = hasVehicleLoaded(vehicle);
    if (!isLoaded) {
        return;
    }

    native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, seat);
}

async function handleVehicleDataChange(vehicle: alt.Vehicle, key: string, value: string): Promise<void> {
    // Handles Vehicle Horns / Flashing etc.
    if (key === Vehicle_State.LOCK_STATE) {
        if (inLockedState(parseInt(value))) {
            vehicle.playCarAlarmHorn(1, 50);
            vehicle.flashLights(1, 50);
            native.playVehicleDoorCloseSound(vehicle.scriptID, 0);
            return;
        }

        vehicle.playCarAlarmHorn(2, 50);
        vehicle.flashLights(2, 50);
        native.playVehicleDoorOpenSound(vehicle.scriptID, 0);
        return;
    }
}
