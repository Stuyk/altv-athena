import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { PedConfigFlag } from '../../shared/flags/pedflags';
import { distance2d, getClosestVectorByPos } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { drawTexture, loadTexture } from '../utility/texture';

export class VehicleController {
    /**
     * Register the default vehicle keybinds.
     * @static
     * @memberof VehicleController
     */
    static registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_FUNCS,
            singlePress: VehicleController.emitAction
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_ENGINE,
            singlePress: VehicleController.emitEngine
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_LOCK,
            singlePress: VehicleController.emitLock
        });

        loadTexture('mpsafecracking');
    }

    /**
     * Called when the player presses the proper key near or inside of a vehicle.
     * @static
     * @memberof VehicleController
     */
    static emitAction() {
        alt.emitServer(VEHICLE_EVENTS.ACTION);
    }

    /**
     * Starts / stops the engine.
     * @static
     * @memberof VehicleController
     */
    static emitEngine() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        alt.emitServer(VEHICLE_EVENTS.SET_ENGINE);
    }

    /**
     * Toggles lock from locked / unlocked.
     * @static
     * @memberof VehicleController
     */
    static emitLock() {
        alt.emitServer(VEHICLE_EVENTS.SET_LOCK);
    }

    static runVehicleControllerTick() {
        if (!alt.Player.local.vehicle) {
            const vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, alt.Vehicle.all, 'pos');

            if (!vehicle) {
                return;
            }

            const vehicleDistance = distance2d(alt.Player.local.pos, vehicle.pos);
            if (vehicleDistance >= 10) {
                return;
            }

            if (!native.hasStreamedTextureDictLoaded('mpsafecracking')) {
                loadTexture('mpsafecracking').then();
            }

            loadTexture('mpsafecracking').then(() => {
                const newPosition = vehicle.pos.add(0, 0, 1);

                if (native.getVehicleDoorLockStatus(vehicle.scriptID) === 2) {
                    drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
                } else {
                    drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
                }
            });
        }
    }

    static enterVehicle() {
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableShufflingToDriverSeat, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableStartingVehEngine, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableStoppingVehEngine, true);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, VehicleController.registerKeybinds);
alt.on('enteredVehicle', VehicleController.enterVehicle);

// export class VehicleController {
//     /**
//      * Used to register all vehicle keybinds.
//      * @static
//      * @memberof VehicleController
//      */
//     static registerKeybinds() {
//         KeybindController.registerKeybind({
//             key: KEY_BINDS.VEHICLE_ENGINE,
//             singlePress: VehicleController.handleToggleEngine
//         });

//         KeybindController.registerKeybind({
//             key: KEY_BINDS.VEHICLE_LOCK,
//             singlePress: VehicleController.handleToggleLock
//         });

//         KeybindController.registerKeybind({
//             key: KEY_BINDS.VEHICLE_FUNCS,
//             singlePress: (...args: any[]) => VehicleController.triggerVehicleFunction('pressedVehicleFunction')
//         });

//         KeybindController.registerKeybind({
//             key: KEY_BINDS.VEHICLE_FUNCS_ALT,
//             singlePress: (...args: any[]) => VehicleController.triggerVehicleFunction('pressedVehicleFunctionAlt')
//         });
//     }

//     static putOnSeatbelt() {
//         native.setPedConfigFlag(alt.Player.local.scriptID, 35, false); // Helmet
//         native.setPedConfigFlag(alt.Player.local.scriptID, 32, false); // Can no longer fly out of windshield.

//         const vehClass = native.getVehicleClass(alt.Player.local.vehicle.scriptID);
//         const isBike = vehClass === 8 || vehClass === 13 ? true : false;

//         if (isBike && !native.isPedWearingHelmet(alt.Player.local.scriptID)) {
//             native.setPedConfigFlag(alt.Player.local.scriptID, 35, true);
//         }

//         BaseHUD.setHudStatus(HudEventNames.Seatbelt, true);
//     }

//     /**
//      * This controls what keys were pressed and what boolean to change for a key press.
//      * Called from the events/keyup.ts file.
//      * @static
//      * @param {string} booleanName
//      * @memberof VehicleController
//      */
//     static triggerVehicleFunction(booleanName: string): void {
//         if (alt.Player.local.isChatOpen) {
//             return;
//         }

//         KEYBIND_TRIGGERS[booleanName] = true;
//     }

//     /**
//      * Sets all keypress booleans to false.
//      * @static
//      * @memberof VehicleController
//      */
//     static turnOffAllVehicleFunctions(): void {
//         pressedLockKey = false;
//         KEYBIND_TRIGGERS.pressedVehicleFunction = false;
//         KEYBIND_TRIGGERS.pressedVehicleFunctionAlt = false;
//     }

//     static updateNextKeyPress(): void {
//         nextControlPress = Date.now() + TIME_BETWEEN_CONTROL_PRESS;
//     }

//     static async updateClosestVehicles() {
//         if (!processingVehicles) {
//             return;
//         }

//         const processedVehicles = [];
//         const currentVehicles = [...alt.Vehicle.all];

//         for (let i = 0; i < currentVehicles.length; i++) {
//             const vehicle = currentVehicles[i];
//             if (distance(alt.Player.local.pos, vehicle.pos) > MAX_VEHICLE_DISTANCE) {
//                 continue;
//             }

//             processedVehicles.push(vehicle);
//         }

//         vehicles = processedVehicles;
//         processingVehicles = false;
//     }

//     /**
//      * Get the closest vehicle to the player or the vehicle they are in.
//      *
//      * @static
//      * @return {*}  {alt.Vehicle}
//      * @memberof VehicleController
//      */
//     static getClosestVehicle(): alt.Vehicle {
//         if (alt.Player.local.vehicle) {
//             return alt.Player.local.vehicle;
//         }

//         return getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, vehicles);
//     }

//     static getMaximums(baseEnum: any, maxValue: number, eventName: string): ActionMenu {
//         const actions: ActionMenu = {};
//         let count = 0;

//         Object.keys(baseEnum).forEach((key) => {
//             // Remove 0, 1, 2, 3, etc. from enum
//             if (parseInt(key, 10) >= -1) {
//                 return;
//             }

//             if (count >= maxValue) {
//                 return;
//             }

//             // Use actual names for enum.
//             actions[key.replace('_', ' ')] = {
//                 eventName,
//                 isServer: false,
//                 data: baseEnum[key]
//             };

//             count += 1;
//         });

//         return actions;
//     }

//     static getVehicleOptions(): ActionMenu {
//         const closestVehicle = VehicleController.getClosestVehicle();
//         if (!closestVehicle || !closestVehicle.model) {
//             return {};
//         }

//         if (distance2d(closestVehicle.pos, alt.Player.local.pos) > MAX_VEHICLE_DISTANCE) {
//             return {};
//         }

//         const vehicleModel = native.getDisplayNameFromVehicleModel(closestVehicle.model);
//         const actions = {
//             [vehicleModel]: {}
//         };

//         // Add Lock Toggle If Owner or Keys
//         if (vehicleFuncs.get.owner(closestVehicle)) {
//             actions[vehicleModel]['Toggle Lock'] = {
//                 eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_LOCK,
//                 isServer: false
//             };
//         }

//         // Outside Vehicle Actions
//         if (!alt.Player.local.vehicle) {
//             if (!closestVehicle) {
//                 return actions;
//             }

//             const short = `~b~${String.fromCharCode(KEY_BINDS.INTERACT)} - ${LocaleController.get(
//                 LOCALE_KEYS.INTERACTION_INTERACT_VEHICLE
//             )}`;

//             const long = `~b~${String.fromCharCode(KEY_BINDS.VEHICLE_LOCK)} - ${LocaleController.get(
//                 LOCALE_KEYS.VEHICLE_TOGGLE_LOCK
//             )}`;

//             alt.Player.local.otherInteraction = {
//                 position: closestVehicle.pos,
//                 short,
//                 long
//             };

//             // Return Current Actions if Vehicle is Locked
//             if (closestVehicle.lockStatus === Vehicle_Lock_State.LOCKED || !closestVehicle.lockStatus) {
//                 return actions;
//             }

//             // Generate Seat Menu
//             const maxSeats = native.getVehicleMaxNumberOfPassengers(closestVehicle.scriptID) + 1;
//             actions[vehicleModel]['Seats'] = VehicleController.getMaximums(
//                 Vehicle_Seat_List,
//                 maxSeats,
//                 CLIENT_VEHICLE_EVENTS.TOGGLE_SEAT
//             );

//             // Generate Door Menu
//             actions[vehicleModel]['Doors'] = {};

//             const vehClass = native.getVehicleClass(closestVehicle.scriptID);
//             const isBike = vehClass === 8 || vehClass === 13 ? true : false;

//             actions[vehicleModel]['Doors']['Driver'] = {
//                 eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR,
//                 isServer: false,
//                 data: Vehicle_Door_List.DRIVER
//             };

//             actions[vehicleModel]['Doors']['Passenger'] = {
//                 eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR,
//                 isServer: false,
//                 data: Vehicle_Door_List.PASSENGER
//             };

//             if (!isBike) {
//                 actions[vehicleModel]['Doors']['Driver Rear'] = {
//                     eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR,
//                     isServer: false,
//                     data: Vehicle_Door_List.DRIVER_REAR
//                 };

//                 actions[vehicleModel]['Doors']['Passenger Rear'] = {
//                     eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR,
//                     isServer: false,
//                     data: Vehicle_Door_List.PASSENGER_REAR
//                 };

//                 actions[vehicleModel]['Doors']['Hood'] = {
//                     eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR,
//                     isServer: false,
//                     data: Vehicle_Door_List.HOOD
//                 };

//                 actions[vehicleModel]['Doors']['Trunk'] = {
//                     eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR,
//                     isServer: false,
//                     data: Vehicle_Door_List.TRUNK
//                 };
//             }

//             return actions;
//         }

//         // In Vehicle Actions
//         if (alt.Player.local.vehicle) {
//             const id = alt.Player.local.scriptID;
//             const isDriver = native.getPedInVehicleSeat(closestVehicle.scriptID, -1, false) === id;

//             // Toggle the engine.
//             if (isDriver) {
//                 actions[vehicleModel]['Toggle Engine'] = {
//                     eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_ENGINE,
//                     isServer: false
//                 };
//             }

//             // Exit the vehicle
//             if (closestVehicle.lockStatus !== Vehicle_Lock_State.LOCKED && closestVehicle.lockStatus) {
//                 actions[vehicleModel]['Exit Vehicle'] = {
//                     eventName: CLIENT_VEHICLE_EVENTS.TOGGLE_SEAT,
//                     isServer: false
//                 };
//             }

//             return actions;
//         }

//         return actions;
//     }

//     /**
//      * Running on an every tick instance.
//      * @static
//      * @return {*}
//      * @memberof VehicleController
//      */
//     static async runVehicleControllerTick(): Promise<void> {
//         if (!processingVehicles) {
//             processingVehicles = true;
//             alt.setTimeout(VehicleController.updateClosestVehicles, 0);
//         }

//         // Stop Entering Vehicle
//         if (native.getVehiclePedIsEntering(alt.Player.local.scriptID) !== 0) {
//             // back
//             if (native.isControlJustPressed(0, 33)) {
//                 native.clearPedTasks(alt.Player.local.scriptID);
//             }

//             // left
//             if (native.isControlJustPressed(0, 34)) {
//                 native.clearPedTasks(alt.Player.local.scriptID);
//             }

//             // right
//             if (native.isControlJustPressed(0, 35)) {
//                 native.clearPedTasks(alt.Player.local.scriptID);
//             }
//         }

//         const closestVehicle = VehicleController.getClosestVehicle();
//         if (!closestVehicle) {
//             KEYBIND_TRIGGERS.pressedVehicleFunction = false;
//             KEYBIND_TRIGGERS.pressedVehicleFunctionAlt = false;
//             return;
//         }

//         if (Date.now() > nextVehicleStateUpdate) {
//             VehicleController.updateVehicleState(closestVehicle);
//         }

//         if (distance2d(closestVehicle.pos, alt.Player.local.pos) > MAX_VEHICLE_DISTANCE) {
//             return;
//         }

//         const exceededNextControlCheck = Date.now() > nextControlPress;

//         // Draw Vehicle Lock
//         if (!alt.Player.local.vehicle) {
//             if (!native.hasStreamedTextureDictLoaded('mpsafecracking')) {
//                 await loadTexture('mpsafecracking');
//             }

//             const newPosition = closestVehicle.pos.add(0, 0, 1);
//             if (closestVehicle.lockStatus === Vehicle_Lock_State.LOCKED || !closestVehicle.lockStatus) {
//                 drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
//             } else {
//                 drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
//             }
//         }

//         // F - Enter / Exit Vehicle
//         if (KEYBIND_TRIGGERS.pressedVehicleFunction && exceededNextControlCheck) {
//             KEYBIND_TRIGGERS.pressedVehicleFunction = false;
//             VehicleController.updateNextKeyPress();
//             VehicleController.enterExitVehicle(closestVehicle, 0);
//             return;
//         }

//         // G - Enter Passenger
//         if (!alt.Player.local.vehicle && KEYBIND_TRIGGERS.pressedVehicleFunctionAlt && exceededNextControlCheck) {
//             KEYBIND_TRIGGERS.pressedVehicleFunctionAlt = false;
//             VehicleController.updateNextKeyPress();
//             VehicleController.enterExitVehicle(closestVehicle, 1);
//             return;
//         }
//     }

//     static enterExitVehicle(closestVehicle: alt.Vehicle, startingAt: number) {
//         const isLocked = closestVehicle.lockStatus === Vehicle_Lock_State.LOCKED || !closestVehicle.lockStatus;
//         if (isLocked) {
//             ChatController.appendMessage(LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_LOCK));
//             return;
//         }

//         if (alt.Player.local.vehicle) {
//             const id = alt.Player.local.scriptID;
//             const isDriver = native.getPedInVehicleSeat(closestVehicle.scriptID, -1, false) === id;

//             native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);

//             if (closestVehicle.engineStatus && isDriver) {
//                 alt.setTimeout(() => {
//                     native.setVehicleEngineOn(closestVehicle.scriptID, true, true, false);
//                 }, 500);
//             }
//             return;
//         }

//         const maxSeats = native.getVehicleMaxNumberOfPassengers(closestVehicle.scriptID);

//         // Start at passenger seat.
//         for (let i = startingAt; i < maxSeats; i++) {
//             const isSeatFree = native.isVehicleSeatFree(closestVehicle.scriptID, i - 1, false);
//             if (isSeatFree) {
//                 alt.log(i);
//                 VehicleController.updatePedFlags(closestVehicle);
//                 native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, i - 1, 2, 1, 0);
//                 return;
//             }
//         }
//     }

//     static handleToggleLock() {
//         if (alt.Player.local.isChatOpen) {
//             return;
//         }

//         if (alt.Player.local.isPhoneOpen) {
//             return;
//         }

//         const vehicle = VehicleController.getClosestVehicle();
//         if (!vehicle) {
//             return;
//         }

//         alt.emitServer(Vehicle_Events.SET_LOCK, vehicle);
//     }

//     static handleToggleEngine() {
//         if (alt.Player.local.isChatOpen) {
//             return;
//         }

//         if (alt.Player.local.isPhoneOpen) {
//             return;
//         }

//         const vehicle = VehicleController.getClosestVehicle();
//         if (!vehicle) {
//             return;
//         }

//         alt.emitServer(Vehicle_Events.SET_ENGINE, vehicle);
//     }

//     static updatePedFlags(vehicle: alt.Vehicle) {
//         const vehClass = native.getVehicleClass(vehicle.scriptID);
//         const isBike = vehClass === 8 || vehClass === 13 ? true : false;

//         if (!isBike) {
//             native.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
//             native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
//             native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
//         } else {
//             native.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
//             native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
//             native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
//             native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
//         }
//     }

//     static handleToggleSeat(seat) {
//         const vehicle = VehicleController.getClosestVehicle();
//         if (!vehicle) {
//             return;
//         }

//         if (vehicle.lockStatus === Vehicle_Lock_State.LOCKED || !vehicle.lockStatus) {
//             return;
//         }

//         if (alt.Player.local.vehicle) {
//             native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
//             return;
//         }

//         VehicleController.updatePedFlags(vehicle);
//         native.taskEnterVehicle(alt.Player.local.scriptID, vehicle.scriptID, 2000, seat, 2, 1, 0);
//     }

//     static handleToggleDoor(door) {
//         const vehicle = VehicleController.getClosestVehicle();
//         if (!vehicle) {
//             return;
//         }

//         if (vehicle.lockStatus === Vehicle_Lock_State.LOCKED || !vehicle.lockStatus) {
//             return;
//         }

//         alt.log(door);
//         alt.emitServer(Vehicle_Events.SET_DOOR, vehicle, door);
//     }

//     static updateVehicleState(closestVehicle: alt.Vehicle): void {
//         nextVehicleStateUpdate = Date.now() + TIME_BETWEEN_STATE_UPDATES;
//         alt.setTimeout(() => {
//             vehicleFuncs.sync.update(closestVehicle);
//         }, 0);
//     }
// }

// async function handleSetInto(vehicle: alt.Vehicle, seat: Vehicle_Seat_List) {
//     waitingForVehicle = vehicle;
//     waitingForSeat = seat;
// }

// function handleVehicleCreated(vehicle: alt.Vehicle): void {
//     if (vehicle !== waitingForVehicle) {
//         return;
//     }

//     native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
//     native.setPedConfigFlag(alt.Player.local.scriptID, 104, true);
//     native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
//     native.setPedIntoVehicle(alt.Player.local.scriptID, waitingForVehicle.scriptID, waitingForSeat);

//     waitingForSeat = null;
//     waitingForVehicle = null;
// }

// async function handleVehicleDataChange(vehicle: alt.Vehicle, key: string, value: any): Promise<void> {
//     if (key === Vehicle_State.DOOR_DRIVER) {
//         vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.DRIVER, value);
//         return;
//     }

//     if (key === Vehicle_State.DOOR_DRIVER_REAR) {
//         vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.DRIVER_REAR, value);
//         return;
//     }

//     if (key === Vehicle_State.DOOR_PASSENGER) {
//         vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.PASSENGER, value);
//         return;
//     }

//     if (key === Vehicle_State.DOOR_PASSENGER_REAR) {
//         vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.PASSENGER_REAR, value);
//         return;
//     }

//     if (key === Vehicle_State.DOOR_HOOD) {
//         vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.HOOD, value);
//         return;
//     }

//     if (key === Vehicle_State.DOOR_TRUNK) {
//         vehicleFuncs.set.doorState(vehicle, Vehicle_Door_List.TRUNK, value);
//         return;
//     }

//     if (key === Vehicle_State.LOCK_STATE) {
//         vehicleFuncs.set.lockStatus(vehicle, value);
//         return;
//     }

//     // Set Owner
//     if (key === Vehicle_State.OWNER) {
//         vehicleFuncs.set.owner(vehicle, value);
//         return;
//     }

//     if (key === Vehicle_State.ENGINE) {
//         vehicleFuncs.set.engine(vehicle, value);
//         return;
//     }

//     if (key === Vehicle_State.FUEL) {
//         vehicleFuncs.set.fuel(vehicle, value);
//         return;
//     }
// }

// alt.onceServer(SYSTEM_EVENTS.TICKS_START, VehicleController.registerKeybinds);
// alt.onServer(Vehicle_Events.SET_SEATBELT, VehicleController.putOnSeatbelt);
// alt.on(CLIENT_VEHICLE_EVENTS.TOGGLE_ENGINE, VehicleController.handleToggleEngine);
// alt.on(CLIENT_VEHICLE_EVENTS.TOGGLE_LOCK, VehicleController.handleToggleLock);
// alt.on(CLIENT_VEHICLE_EVENTS.TOGGLE_SEAT, VehicleController.handleToggleSeat);
// alt.on(CLIENT_VEHICLE_EVENTS.TOGGLE_DOOR, VehicleController.handleToggleDoor);
