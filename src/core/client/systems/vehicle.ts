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
import { sleep } from '../utility/sleep';
import { updateHelpText } from '../views/hud/hud';

alt.onServer(Vehicle_Events.SET_INTO, handleSetInto);
alt.on('streamSyncedMetaChange', handleVehicleDataChange);

const TIME_BETWEEN_CONTROL_PRESS = 250;
const TIME_BETWEEN_STATE_UPDATES = 5000;
const TIME_BETWEEN_CHECKS = 1000;
const MAX_VEHICLE_DISTANCE = 8;

export class VehicleController {
    // The different states for this controller
    static pressedLockKey: false;
    static pressedVehicleFunction: false;
    static pressedVehicleFunctionAlt: false;

    // Data we look at
    static vehicles: alt.Vehicle[];

    // Cooldown Helpers
    static nextVehicleCheck: number = Date.now();
    static nextControlPress: number = Date.now();
    static nextVehicleStateUpdate: number = Date.now() + TIME_BETWEEN_STATE_UPDATES;

    constructor() {}

    /**
     * This controls what keys were pressed and what boolean to change for a key press.
     * Called from the events/keyup.ts file.
     * @static
     * @param {string} booleanName
     * @memberof VehicleController
     */
    static triggerVehicleFunction(booleanName: string): void {
        this[booleanName] = true;
    }

    /**
     * Sets all keypress booleans to false.
     * @static
     * @memberof VehicleController
     */
    static turnOffAllVehicleFunctions(): void {
        this.pressedLockKey = false;
        this.pressedVehicleFunction = false;
        this.pressedVehicleFunctionAlt = false;
    }

    static updateNextKeyPress(): void {
        this.nextControlPress = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
    }

    /**
     * Running on an every tick instance.
     * @static
     * @return {*}
     * @memberof VehicleController
     */
    static runVehicleControllerTick(): void {
        if (Date.now() > this.nextVehicleCheck) {
            this.nextVehicleCheck = Date.now() + TIME_BETWEEN_CHECKS;
            this.vehicles = [...alt.Vehicle.all].filter((vehicle) => {
                return distance(alt.Player.local.pos, vehicle.pos) <= MAX_VEHICLE_DISTANCE;
            });
        }

        if (this.vehicles.length <= 0) {
            this.turnOffAllVehicleFunctions();
            return;
        }

        if (alt.Player.local.vehicle) {
            this.handleInVehicle();
            return;
        }

        this.handleOutOfVehicle();
    }

    static handleLockPress(closeVehicle: alt.Vehicle): void {
        alt.log('pressed lock key');
        this.turnOffAllVehicleFunctions();
        this.updateNextKeyPress();
        alt.emitServer(Vehicle_Events.SET_LOCK, closeVehicle);
    }

    static updateVehicleState(closestVehicle: alt.Vehicle): void {
        this.nextVehicleStateUpdate = Date.now() + TIME_BETWEEN_STATE_UPDATES;
        closestVehicle.handleSyncIn();
    }

    /**
     * Handle what the player can do inside of the vehicle.
     * @static
     * @return {*}  {Promise<void>}
     * @memberof VehicleController
     */
    static async handleInVehicle(): Promise<void> {
        if (Date.now() > this.nextVehicleStateUpdate) {
            this.updateVehicleState(alt.Player.local.vehicle);
        }

        // Toggling the Lock / Short Press X
        if (this.pressedLockKey && Date.now() > this.nextControlPress) {
            this.handleLockPress(alt.Player.local.vehicle);
            return;
        }

        // Leaving the Vehicle / Short Press / Leave Engine Running
        if (this.pressedVehicleFunction && Date.now() > this.nextControlPress) {
            this.turnOffAllVehicleFunctions();
            this.updateNextKeyPress();

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
            await sleep(500);
            native.setVehicleEngineOn(currentVehicle, true, true, false);
            return;
        }

        // Check if the local player is a driver.
        if (native.getPedInVehicleSeat(alt.Player.local.vehicle.scriptID, -1, 0) !== alt.Player.local.scriptID) {
            return;
        }

        // Toggle Engine Status with Long Press
        if (this.pressedVehicleFunctionAlt && Date.now() > this.nextControlPress) {
            this.turnOffAllVehicleFunctions();
            this.updateNextKeyPress();
            alt.emitServer(Vehicle_Events.SET_ENGINE);
            return;
        } else {
            const vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
            const vehicleName = vehClass === 8 || vehClass === 13 ? 'Bike' : 'Vehicle';

            if (!alt.Player.local.vehicle.engineStatus) {
                updateHelpText(70, `Exit ${vehicleName}`, `Turn on Engine`);
            } else {
                updateHelpText(70, `Exit ${vehicleName}`, `Turn off Engine`);
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
        const closestVehicle: alt.Vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, this.vehicles);
        if (!closestVehicle) {
            return;
        }

        if (Date.now() > this.nextVehicleStateUpdate) {
            this.updateVehicleState(closestVehicle);
        }

        if (this.pressedLockKey && Date.now() > this.nextControlPress) {
            this.handleLockPress(closestVehicle);
            return;
        }

        // Update Help Text based on if the vehicle is locked.
        const lock: Vehicle_Lock_State = closestVehicle.getStreamSyncedMeta(Vehicle_State.LOCK_STATE);
        if (inLockedState(lock)) {
            if (!closestVehicle.isOwner()) {
                return;
            }

            let lockName = Vehicle_Lock_State[lock];

            if (lock === null || lock === undefined) {
                lockName = 'LOCKED';
            }

            const increasedZ = new alt.Vector3(closestVehicle.pos.x, closestVehicle.pos.y, closestVehicle.pos.z + 1);
            drawMarker(0, increasedZ, new alt.Vector3(0.075, 0.075, 0.075), new alt.RGBA(255, 255, 255, 200));
            updateHelpText(KEY_BINDS.VEHICLE_LOCK, `Cycle Lock (${lockName.replace('_', ' ')})`, null);
            return;
        }

        // Wait for next control press to be ready.
        if (Date.now() < this.nextControlPress) {
            return;
        }

        // Get the closest Door.
        const vehClass = native.getVehicleClass(closestVehicle.scriptID);
        const isBike = vehClass === 8 || vehClass === 13 ? true : false;

        // Get onto the bike based on seat availability
        if (isBike) {
            updateHelpText(KEY_BINDS.VEHICLE_FUNCS, `Get on Bike`, null);

            if (!this.pressedVehicleFunction) {
                return;
            }

            this.turnOffAllVehicleFunctions();
            this.updateNextKeyPress();

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

        const closestDoor = closestVehicle.getClosestDoor(alt.Player.local.pos);
        drawMarker(28, closestDoor.pos, new alt.Vector3(0.075, 0.075, 0.075), new alt.RGBA(255, 255, 255, 200));

        if (closestDoor.isDoor) {
            updateHelpText(70, null, `Toggle Door`);
        } else {
            updateHelpText(70, `Enter Vehicle`, `Toggle Door`);
        }

        // Short Press F
        if (this.pressedVehicleFunction) {
            this.turnOffAllVehicleFunctions();
            this.updateNextKeyPress();

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
        if (this.pressedVehicleFunctionAlt) {
            this.turnOffAllVehicleFunctions();
            this.updateNextKeyPress();

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
    // if (key === Vehicle_State.LOCK_STATE) {
    //     if (inLockedState(parseInt(value))) {
    //         vehicle.closeAllDoors();
    //         return;
    //     }

    //     vehicle.playCarAlarmHorn(2, 50);
    //     vehicle.flashLights(2, 50);
    //     return;
    // }

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
