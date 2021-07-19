import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '../../shared/enums/keybinds';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { AnimationFlags } from '../../shared/flags/animation';
import { PedConfigFlag } from '../../shared/flags/pedflags';
import { getClosestVectorByPos } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { isAnyMenuOpen } from '../utility/menus';
import { Timer } from '../utility/timers';
import { WheelMenu } from '../utility/wheelMenu';
import { playAnimation } from './animations';

let interval;

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

        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_OPTIONS,
            singlePress: VehicleController.emitOptions
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
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableShufflingToDriverSeat, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableStartingVehEngine, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableStoppingVehEngine, true);
    }

    static pushVehicle(vehicle: alt.Vehicle) {
        const [_null, min, max] = native.getModelDimensions(vehicle.model);
        native.disableControlAction(0, 32, true);
        native.disableControlAction(0, 34, true);
        native.disableControlAction(0, 9, true);

        if (!native.isEntityAttachedToEntity(alt.Player.local.scriptID, vehicle.scriptID)) {
            native.attachEntityToEntity(
                alt.Player.local.scriptID,
                vehicle.scriptID,
                native.getPedBoneIndex(alt.Player.local.scriptID, 6286),
                0,
                min.y - 0.3,
                min.z + 1,
                0,
                0,
                0,
                false,
                false,
                true,
                false,
                0,
                true
            );
        }

        const isPlayingAnim = native.isEntityPlayingAnim(
            alt.Player.local.scriptID,
            'missfinale_c2ig_11',
            'pushcar_offcliff_m',
            3
        );

        // S
        if (native.isControlJustReleased(0, 8)) {
            if (interval) {
                Timer.clearInterval(interval);
                interval = null;
            }

            native.detachEntity(vehicle.scriptID, false, false);
            native.detachEntity(alt.Player.local.scriptID, false, false);
            alt.emitServer(VEHICLE_EVENTS.STOP_PUSH);
            return;
        }

        // W
        if (native.isDisabledControlPressed(0, 32)) {
            if (!isPlayingAnim) {
                playAnimation(
                    'missfinale_c2ig_11',
                    'pushcar_offcliff_m',
                    AnimationFlags.REPEAT | AnimationFlags.ENABLE_PLAYER_CONTROL
                );
            }

            native.setVehicleForwardSpeed(vehicle.scriptID, 1);

            // A
            if (native.isDisabledControlPressed(0, 34)) {
                native.taskVehicleTempAction(alt.Player.local.scriptID, vehicle.scriptID, 11, 1000);
            }

            // D
            if (native.isDisabledControlPressed(0, 9)) {
                native.taskVehicleTempAction(alt.Player.local.scriptID, vehicle.scriptID, 10, 1000);
            }

            if (native.hasEntityCollidedWithAnything(vehicle.scriptID)) {
                native.setVehicleOnGroundProperly(vehicle.scriptID, 0);
            }
        } else {
            native.clearPedTasks(alt.Player.local.scriptID);
        }
    }

    static emitOptions() {
        if (isAnyMenuOpen()) {
            return;
        }

        const vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, alt.Vehicle.all, 'pos');
        if (!vehicle || !vehicle.valid) {
            return;
        }

        const options = [];
        const isPushing = alt.Player.local.hasSyncedMeta(PLAYER_SYNCED_META.PUSHING_VEHICLE);

        if (!isPushing) {
            options.push({
                name: 'Push',
                callback: () => {
                    if (interval) {
                        Timer.clearInterval(interval);
                        interval = null;
                    }

                    alt.emitServer(VEHICLE_EVENTS.PUSH);
                    interval = Timer.createInterval(
                        () => {
                            VehicleController.pushVehicle(vehicle);
                        },
                        0,
                        'vehicle.ts - pushing'
                    );
                }
            });
        } else {
            options.push({
                name: 'Stop Push',
                callback: () => {
                    if (interval) {
                        alt.clearInterval(interval);
                        interval = null;
                    }

                    native.detachEntity(vehicle.scriptID, false, false);
                    native.detachEntity(alt.Player.local.scriptID, false, false);
                    alt.emitServer(VEHICLE_EVENTS.STOP_PUSH);
                }
            });
        }

        WheelMenu.create('Vehicle Options', options);
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
}

alt.on(VEHICLE_EVENTS.SET_INTO, VehicleController.setIntoVehicle);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, VehicleController.registerKeybinds);
alt.on('enteredVehicle', VehicleController.enterVehicle);
