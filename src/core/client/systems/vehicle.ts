import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';
import {
    Vehicle_Events,
    Vehicle_Lock_State,
    Vehicle_State,
    inLockedState,
    Vehicle_Seat_List,
    Vehicle_Door_List
} from '../../shared/enums/vehicle';
import { distance, getClosestVectorByPos } from '../../shared/utility/vector';
import { DoorData } from '../extensions/Vehicle';
import { sleep } from '../utility/sleep';
import { drawText2D, drawText3D } from '../utility/text';

alt.onServer(Vehicle_Events.SET_INTO, handleSetInto);
alt.onServer(Events_Misc.StartTicks, startTick);
alt.on('streamSyncedMetaChange', handleVehicleDataChange);

const TIME_BETWEEN_CONTROL_PRESS = 250;
const TIME_BETWEEN_CHECKS = 1500;
const TOGGLE_LOCK_MESSAGE = `X - Toggle Lock`;
const MAX_VEHICLE_DISTANCE = 10;

let nextVehicleCheck: number = Date.now();
let timeBetweenControls: number = Date.now();
let interval: number;
let vehicles: alt.Vehicle[];
let pressedLockKey = false;
let pressedVehicleFunction = false;
let pressedVehicleFunctionAlt = false;

export function triggerVehicleLock(): void {
    pressedLockKey = true;
}

export function triggerVehicleFunction(): void {
    pressedVehicleFunction = true;
}

export function triggerVehicleFunctionAlt(): void {
    pressedVehicleFunctionAlt = true;
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
    if (pressedLockKey && Date.now() > timeBetweenControls) {
        handleLock(alt.Player.local.vehicle);
        return;
    }

    if (pressedVehicleFunction && Date.now() > timeBetweenControls) {
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

    if (native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1, 0) === alt.Player.local.scriptID) {
        if (!alt.Player.local.vehicle.engineStatus) {
            drawText3D(
                `[~y~${String.fromCharCode(70)}-Hold~w~] - Engine`,
                alt.Player.local.pos,
                0.3,
                new alt.RGBA(255, 255, 255, 255)
            );
        }

        if (pressedVehicleFunctionAlt && Date.now() > timeBetweenControls) {
            pressedVehicleFunctionAlt = false;
            timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
            alt.emitServer(Vehicle_Events.SET_ENGINE);
            return;
        }
    }
}

function handleLock(closestVehicle: alt.Vehicle): void {
    pressedLockKey = false;
    timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
    alt.emitServer(Vehicle_Events.SET_LOCK, closestVehicle);
}

async function handleOutOfVehicle(): Promise<void> {
    // Uses a pre-refined list of vehicles for sorting.
    const closestVehicle: alt.Vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, vehicles);

    // Get the closest vehicle based on vehicles.
    if (!closestVehicle) {
        return;
    }

    // drawRectangle(closestVehicle.pos, { x: 0.02, y: 0.1 }, new alt.RGBA(255, 255, 255, 255));

    // Check if the vehicle is locked *server-side*
    // Handles the 'X' key press to try and toggle lock.
    if (pressedLockKey && Date.now() > timeBetweenControls) {
        handleLock(closestVehicle);
        return;
    }

    // Check the lockstate and draw information to a key holder or owner.
    const lock: Vehicle_Lock_State = closestVehicle.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);

    if (closestVehicle.owner === alt.Player.local.id.toString()) {
        const keyName = String.fromCharCode(88);
        let lockName = Vehicle_Lock_State[lock];

        if (lock === null || lock === undefined) {
            lockName = 'LOCKED';
        }

        const modifiedPos = {
            x: closestVehicle.pos.x,
            y: closestVehicle.pos.y,
            z: closestVehicle.pos.z + 1
        } as alt.Vector3;

        drawText3D(
            `[~y~${keyName}~w~]~n~${lockName.replace('_', ' ')}`,
            modifiedPos,
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );
    }

    if (inLockedState(lock)) {
        return;
    }

    // Get the closest Door.
    const vehClass = native.getVehicleClass(closestVehicle.scriptID);
    const isBike = vehClass === 8 || vehClass === 13 ? true : false;

    let closestDoor: DoorData;
    if (!isBike) {
        closestDoor = closestVehicle.getClosestDoor(alt.Player.local.pos);
    }

    if (isBike) {
        drawText3D(
            `[~y~${String.fromCharCode(70)}~w~] - Enter`,
            closestVehicle.pos,
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );

        if (!pressedVehicleFunction) {
            return;
        }

        pressedVehicleFunction = false;

        native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);

        const isDriverFree = native.isVehicleSeatFree(closestVehicle.scriptID, -1, false);
        if (isDriverFree) {
            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
            native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, -1, 2, 1, 0);
            return;
        }

        const isPassengerFree = native.isVehicleSeatFree(closestVehicle.scriptID, 0, false);
        if (isPassengerFree) {
            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
            native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, 0, 2, 1, 0);
            return;
        }
        return;
    }

    if (closestDoor.isDoor) {
        drawText3D(
            `[~y~${String.fromCharCode(70)}~w~] - Toggle`,
            closestDoor.pos,
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );
    } else {
        drawText3D(
            `[~y~${String.fromCharCode(70)}~w~] - Enter~n~[~y~Hold~w~] Toggle Door`,
            closestDoor.pos,
            0.3,
            new alt.RGBA(255, 255, 255, 255)
        );
    }

    if (Date.now() < timeBetweenControls) {
        return;
    }

    // Short Press F
    if (pressedVehicleFunction) {
        pressedVehicleFunction = false;
        timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;

        if (closestDoor.isDoor) {
            alt.emitServer(Vehicle_Events.SET_DOOR, closestVehicle, closestDoor.seat);
            return;
        }

        native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
        native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, closestDoor.seat, 2, 1, 0);
        return;
    }

    // Long Press F
    if (pressedVehicleFunctionAlt) {
        pressedVehicleFunctionAlt = false;
        timeBetweenControls = Date.now() + TIME_BETWEEN_CONTROL_PRESS;

        let actualSeat = closestDoor.seat;

        // Add 1 because driver seat is -1
        if (actualSeat <= 2) {
            actualSeat += 1;
        }

        if (!closestVehicle.isDoorOpen(actualSeat)) {
            native.taskOpenVehicleDoor(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, actualSeat, 0);
            await sleep(1000);
        }

        alt.emitServer(Vehicle_Events.SET_DOOR, closestVehicle, actualSeat);
        return;
    }
}

function handleInterval() {
    if (alt.Player.local.isMenuOpen) {
        pressedLockKey = false;
        pressedVehicleFunction = false;
        pressedVehicleFunctionAlt = false;
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
        pressedVehicleFunctionAlt = false;
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

async function handleVehicleDataChange(vehicle: alt.Vehicle, key: string, value: any): Promise<void> {
    // Handles Vehicle Horns / Flashing etc.
    if (key === Vehicle_State.LOCK_STATE) {
        if (inLockedState(parseInt(value))) {
            vehicle.playCarAlarmHorn(1, 50);
            vehicle.flashLights(1, 50);
            vehicle.closeAllDoors();
            native.playVehicleDoorCloseSound(vehicle.scriptID, 0);
            return;
        }

        vehicle.playCarAlarmHorn(2, 50);
        vehicle.flashLights(2, 50);
        native.playVehicleDoorOpenSound(vehicle.scriptID, 0);
        return;
    }

    // Handles Vehicle Door States
    // Yes I know I can make an algorithm for this.
    // However, nobody can actually read that so here's a bunch of iffffsssss.
    if (key === Vehicle_State.DOOR_DRIVER) {
        vehicle.setDoorState(Vehicle_Door_List.DRIVER, value);
        return;
    }

    if (key === Vehicle_State.DOOR_DRIVER_REAR) {
        vehicle.setDoorState(Vehicle_Door_List.DRIVER_REAR, value);
        return;
    }

    if (key === Vehicle_State.DOOR_PASSENGER) {
        vehicle.setDoorState(Vehicle_Door_List.PASSENGER, value);
        return;
    }

    if (key === Vehicle_State.DOOR_PASSENGER_REAR) {
        vehicle.setDoorState(Vehicle_Door_List.PASSENGER_REAR, value);
        return;
    }

    if (key === Vehicle_State.DOOR_HOOD) {
        vehicle.setDoorState(Vehicle_Door_List.HOOD, value);
        return;
    }

    if (key === Vehicle_State.DOOR_TRUNK) {
        vehicle.setDoorState(Vehicle_Door_List.TRUNK, value);
        return;
    }

    // Set Owner
    if (key === Vehicle_State.OWNER) {
        vehicle.setOwner(value.toString());
        return;
    }

    if (key === Vehicle_State.ENGINE) {
        vehicle.setEngine(value);
        return;
    }
}
