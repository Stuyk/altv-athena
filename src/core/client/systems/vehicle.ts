import * as alt from 'alt-client';
import * as native from 'natives';
import {
    Vehicle_Events,
    Vehicle_Lock_State,
    Vehicle_State,
    inLockedState,
    Vehicle_Seat_List,
    Vehicle_Door_List
} from '../../shared/enums/vehicle';
import { distance, getClosestVectorByPos } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { HelpController } from '../views/hud/controllers/helpController';
import vehicleFuncs from '../extensions/Vehicle';

alt.onServer(Vehicle_Events.SET_INTO, handleSetInto);
alt.on('streamSyncedMetaChange', handleVehicleDataChange);
alt.on('vehicle:Created', handleVehicleCreated);

const TIME_BETWEEN_CONTROL_PRESS = 250;
const TIME_BETWEEN_STATE_UPDATES = 2500;
const MAX_VEHICLE_DISTANCE = 8;

let waitingForVehicle: alt.Vehicle | null = null;
let waitingForSeat: number | null;

export class VehicleController {
    static processingVehicles = false;

    // The different states for this controller
    static pressedLockKey: false;
    static pressedVehicleFunction: false;
    static pressedVehicleFunctionAlt: false;

    // Data we look at
    static vehicles: alt.Vehicle[] = [];

    // Cooldown Helpers
    static nextVehicleCheck: number = Date.now();
    static nextControlPress: number = Date.now();
    static nextVehicleStateUpdate: number = Date.now() + TIME_BETWEEN_STATE_UPDATES;

    /**
     * This controls what keys were pressed and what boolean to change for a key press.
     * Called from the events/keyup.ts file.
     * @static
     * @param {string} booleanName
     * @memberof VehicleController
     */
    static triggerVehicleFunction(booleanName: string): void {
        if (!alt.Player.local.isInteractionOn) {
            return;
        }

        this[booleanName] = true;
    }

    /**
     * Sets all keypress booleans to false.
     * @static
     * @memberof VehicleController
     */
    static turnOffAllVehicleFunctions(): void {
        VehicleController.pressedLockKey = false;
        VehicleController.pressedVehicleFunction = false;
        VehicleController.pressedVehicleFunctionAlt = false;
    }

    static updateNextKeyPress(): void {
        VehicleController.nextControlPress = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
    }

    static async updateClosestVehicles() {
        if (!VehicleController.processingVehicles) {
            return;
        }

        const processedVehicles = [];
        const vehicles = [...alt.Vehicle.all];

        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];
            if (distance(alt.Player.local.pos, vehicle.pos) > MAX_VEHICLE_DISTANCE) {
                continue;
            }

            processedVehicles.push(vehicle);
        }

        VehicleController.vehicles = processedVehicles;
        VehicleController.processingVehicles = false;
    }

    /**
     * Running on an every tick instance.
     * @static
     * @return {*}
     * @memberof VehicleController
     */
    static runVehicleControllerTick(): void {
        if (!VehicleController.processingVehicles) {
            VehicleController.processingVehicles = true;
            alt.setTimeout(VehicleController.updateClosestVehicles, 0);
        }

        if (alt.Player.local.vehicle) {
            VehicleController.handleInVehicle();
            return;
        }

        if (VehicleController.vehicles.length <= 0) {
            VehicleController.turnOffAllVehicleFunctions();
            return;
        }

        VehicleController.handleOutOfVehicle();
    }

    static handleLockPress(closeVehicle: alt.Vehicle): void {
        VehicleController.turnOffAllVehicleFunctions();
        VehicleController.updateNextKeyPress();
        alt.emitServer(Vehicle_Events.SET_LOCK, closeVehicle);
    }

    static updateVehicleState(closestVehicle: alt.Vehicle): void {
        VehicleController.nextVehicleStateUpdate = Date.now() + TIME_BETWEEN_STATE_UPDATES;
        alt.setTimeout(() => {
            vehicleFuncs.sync.update(closestVehicle);
        }, 0);
    }

    /**
     * Handle what the player can do inside of the vehicle.
     * @static
     * @return {*}  {Promise<void>}
     * @memberof VehicleController
     */
    static async handleInVehicle(): Promise<void> {
        if (Date.now() > VehicleController.nextVehicleStateUpdate) {
            VehicleController.updateVehicleState(alt.Player.local.vehicle);
        }

        // Toggling the Lock / Short Press X
        if (VehicleController.pressedLockKey && Date.now() > VehicleController.nextControlPress) {
            VehicleController.handleLockPress(alt.Player.local.vehicle);
            return;
        }

        const isDriver =
            native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1, 0) === alt.Player.local.scriptID;

        // Leaving the Vehicle / Short Press / Leave Engine Running
        if (VehicleController.pressedVehicleFunction && Date.now() > VehicleController.nextControlPress) {
            VehicleController.turnOffAllVehicleFunctions();
            VehicleController.updateNextKeyPress();

            // Prevent a player from leaving the vehicle if in kidnap mode.
            const lock: Vehicle_Lock_State = alt.Player.local.vehicle.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);
            if (Vehicle_Lock_State.KIDNAP_MODE === lock) {
                return;
            }

            // Get the vehicle before they exit the vehicle.
            const currentVehicle = alt.Player.local.vehicle.scriptID;
            native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);

            if (!alt.Player.local.vehicle.engineStatus) {
                return;
            }

            // Toggle engine back on if it's turned off.
            alt.setTimeout(() => {
                native.setVehicleEngineOn(currentVehicle, true, true, false);
            }, 500);
            return;
        }

        const canExit = vehicleFuncs.get.canExit(alt.Player.local.vehicle);

        // Check if the local player is a driver.
        if (!isDriver) {
            if (canExit) {
                alt.log('should be able to exit');
                HelpController.updateHelpText(70, `Exit Vehicle`, '');
            }
            return;
        }

        // Toggle Engine Status with Long Press
        if (VehicleController.pressedVehicleFunctionAlt && Date.now() > VehicleController.nextControlPress) {
            VehicleController.turnOffAllVehicleFunctions();
            VehicleController.updateNextKeyPress();
            alt.emitServer(Vehicle_Events.SET_ENGINE);
        } else {
            const vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
            const vehicleName = vehClass === 8 || vehClass === 13 ? 'Bike' : 'Vehicle';

            if (!alt.Player.local.vehicle.engineStatus) {
                HelpController.updateHelpText(70, canExit ? `Exit ${vehicleName}` : '', `Turn on Engine`);
            } else {
                HelpController.updateHelpText(70, canExit ? `Exit ${vehicleName}` : '', `Turn off Engine`);
            }
        }
    }

    /**
     * Player is not in a vehicle.
     * @static
     * @return {*}  {Promise<void>}
     * @memberof VehicleController
     */
    static async handleOutOfVehicle(): Promise<void> {
        const closestVehicle: alt.Vehicle = getClosestVectorByPos<alt.Vehicle>(
            alt.Player.local.pos,
            VehicleController.vehicles
        );
        if (!closestVehicle) {
            return;
        }

        if (Date.now() > VehicleController.nextVehicleStateUpdate) {
            VehicleController.updateVehicleState(closestVehicle);
        }

        if (VehicleController.pressedLockKey && Date.now() > VehicleController.nextControlPress) {
            VehicleController.handleLockPress(closestVehicle);
            return;
        }

        // Update Help Text based on if the vehicle is locked.
        const lock: Vehicle_Lock_State = closestVehicle.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);
        if (inLockedState(lock)) {
            if (!vehicleFuncs.get.owner(closestVehicle)) {
                return;
            }

            let lockName = Vehicle_Lock_State[lock];

            if (lock === null || lock === undefined) {
                lockName = 'LOCKED';
            }

            const increasedZ = new alt.Vector3(closestVehicle.pos.x, closestVehicle.pos.y, closestVehicle.pos.z + 1);
            drawMarker(0, increasedZ, new alt.Vector3(0.075, 0.075, 0.075), new alt.RGBA(255, 255, 255, 200));
            HelpController.updateHelpText(KEY_BINDS.VEHICLE_LOCK, `Cycle Lock (${lockName.replace('_', ' ')})`, null);
            return;
        }

        // Wait for next control press to be ready.
        if (Date.now() < VehicleController.nextControlPress) {
            return;
        }

        // Get the closest Door.
        const vehClass = native.getVehicleClass(closestVehicle.scriptID);
        const isBike = vehClass === 8 || vehClass === 13 ? true : false;

        // Get onto the bike based on seat availability
        if (isBike) {
            HelpController.updateHelpText(KEY_BINDS.VEHICLE_FUNCS, `Get on Bike`, null);

            if (!VehicleController.pressedVehicleFunction) {
                return;
            }

            VehicleController.turnOffAllVehicleFunctions();
            VehicleController.updateNextKeyPress();

            native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
            native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);

            const isDriverFree = native.isVehicleSeatFree(closestVehicle.scriptID, -1, false);
            if (isDriverFree) {
                native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, -1, 2, 1, 0);
                return;
            }

            const isPassengerFree = native.isVehicleSeatFree(closestVehicle.scriptID, 0, false);
            if (isPassengerFree) {
                native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
                native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, 0, 2, 1, 0);
                return;
            }
            return;
        }

        const closestDoor = vehicleFuncs.get.closestDoor(closestVehicle, alt.Player.local.pos);
        drawMarker(28, closestDoor.pos, new alt.Vector3(0.075, 0.075, 0.075), new alt.RGBA(255, 255, 255, 200));

        if (closestDoor.isDoor) {
            HelpController.updateHelpText(70, null, `Toggle Door`);
        } else {
            HelpController.updateHelpText(70, `Enter Vehicle`, `Toggle Door`);
        }

        // Short Press F
        if (VehicleController.pressedVehicleFunction) {
            VehicleController.turnOffAllVehicleFunctions();
            VehicleController.updateNextKeyPress();

            if (closestDoor.isDoor) {
                return;
            }

            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
            native.taskEnterVehicle(
                alt.Player.local.scriptID,
                closestVehicle.scriptID,
                2000,
                closestDoor.seat,
                2,
                1,
                0
            );
            return;
        }

        // Long Press F
        if (VehicleController.pressedVehicleFunctionAlt) {
            VehicleController.turnOffAllVehicleFunctions();
            VehicleController.updateNextKeyPress();

            let actualSeat = closestDoor.seat;

            // Add 1 because driver seat is -1
            if (actualSeat <= 2) {
                actualSeat += 1;
            }

            alt.emitServer(Vehicle_Events.SET_DOOR, closestVehicle, actualSeat);
            return;
        }
    }
}

async function handleSetInto(vehicle: alt.Vehicle, seat: Vehicle_Seat_List) {
    waitingForVehicle = vehicle;
    waitingForSeat = seat;
}

function handleVehicleCreated(vehicle: alt.Vehicle): void {
    if (vehicle !== waitingForVehicle) {
        return;
    }

    native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
    native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
    native.setPedIntoVehicle(alt.Player.local.scriptID, waitingForVehicle.scriptID, waitingForSeat);

    waitingForSeat = null;
    waitingForVehicle = null;
}

async function handleVehicleDataChange(vehicle: alt.Vehicle, key: string, value: any): Promise<void> {
    if (key === Vehicle_State.DOOR_DRIVER) {
        vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.DRIVER, value);
        return;
    }

    if (key === Vehicle_State.DOOR_DRIVER_REAR) {
        vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.DRIVER_REAR, value);
        return;
    }

    if (key === Vehicle_State.DOOR_PASSENGER) {
        vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.PASSENGER, value);
        return;
    }

    if (key === Vehicle_State.DOOR_PASSENGER_REAR) {
        vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.PASSENGER_REAR, value);
        return;
    }

    if (key === Vehicle_State.DOOR_HOOD) {
        vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.HOOD, value);
        return;
    }

    if (key === Vehicle_State.DOOR_TRUNK) {
        vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.TRUNK, value);
        return;
    }

    if (key === Vehicle_State.LOCK_STATE) {
        vehicleFuncs.set.lockStatus(vehicle, value);
        return;
    }

    // Set Owner
    if (key === Vehicle_State.OWNER) {
        vehicleFuncs.set.owner(vehicle, value.toString());
        return;
    }

    if (key === Vehicle_State.ENGINE) {
        vehicleFuncs.set.engine(vehicle, value);
        return;
    }
}
