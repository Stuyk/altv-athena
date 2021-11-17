import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '../../shared/enums/KeyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { VEHICLE_EVENTS } from '../../shared/enums/Vehicle';
import { PED_CONFIG_FLAG } from '../../shared/flags/pedFlags';
import { KeybindController } from '../events/keyup';
import { isAnyMenuOpen } from '../utility/menus';

import './push';

export class VehicleController {
    /**
     * Register the default vehicle keybinds.
     * @static
     * @memberof VehicleController
     */
    static registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_FUNCS,
            singlePress: VehicleController.emitAction,
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_ENGINE,
            singlePress: VehicleController.emitEngine,
        });

        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_LOCK,
            singlePress: VehicleController.emitLock,
        });
    }

    /**
     * Called when the player presses the proper key near or inside of a vehicle.
     * @static
     * @memberof VehicleController
     */
    static emitAction() {
        if (isAnyMenuOpen()) {
            return;
        }

        alt.emitServer(VEHICLE_EVENTS.ACTION);
    }

    /**
     * Starts / stops the engine.
     * @static
     * @memberof VehicleController
     */
    static emitEngine() {
        if (isAnyMenuOpen()) {
            return;
        }

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
        if (isAnyMenuOpen()) {
            return;
        }

        alt.emitServer(VEHICLE_EVENTS.SET_LOCK);
    }

    /**
     * Prevents seat shuffling and engine control.
     * @static
     * @memberof VehicleController
     */
    static enterVehicle() {
        native.setPedConfigFlag(alt.Player.local.scriptID, PED_CONFIG_FLAG.DISABLE_SEAT_SHUFFLE, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PED_CONFIG_FLAG.DISABLE_STARTING_VEHICLE_ENGINE, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PED_CONFIG_FLAG.DISABLE_STOPPING_VEHICLE_ENGINE, true);
    }

    /**
     * Warps the local player into the vehicle.
     * @static
     * @memberof VehicleController
     */
    static async setIntoVehicle(vehicle: alt.Vehicle, seat: number) {
        const isVehicleReady = await new Promise((resolve: Function) => {
            let attempts = 0;

            const interval = alt.setInterval(() => {
                attempts += 1;

                if (attempts >= 100) {
                    alt.clearInterval(interval);
                    resolve(false);
                    return;
                }

                if (!vehicle.valid) {
                    return;
                }

                alt.clearInterval(interval);
                resolve(true);
            }, 200);
        });

        if (!isVehicleReady) {
            return;
        }

        native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, seat);
    }

    /**
     * Prevents a pedestrian from flying out of a vehicle window.
     * @static
     * @param {boolean} [value=true]
     * @memberof VehicleController
     */
    static enableSeatBelt(value: boolean = true) {
        const seatBeltStatus = value ? false : true;
        native.setPedConfigFlag(alt.Player.local.scriptID, PED_CONFIG_FLAG.CAN_FLY_THROUGH_WINDSHIELD, seatBeltStatus);
    }
}

alt.onServer(VEHICLE_EVENTS.SET_SEATBELT, VehicleController.enableSeatBelt);
alt.onServer(VEHICLE_EVENTS.SET_INTO, VehicleController.setIntoVehicle);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, VehicleController.registerKeybinds);
alt.on('enteredVehicle', VehicleController.enterVehicle);
