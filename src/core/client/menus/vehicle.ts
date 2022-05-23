import * as alt from 'alt-client';
import * as native from 'natives';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { distance, getClosestVectorByPos } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WheelMenu } from '../views/wheelMenu';

const vehicleMenuInjections: Array<
    (player: alt.Player, vehicle: alt.Vehicle, options?: Array<IWheelOptionExt>) => Array<IWheelOptionExt> | void
> = [];

export default class VehicleMenu {
    /**
     * Lets you create an injection into the vehicle menu options
     *
     * This means you can create new options from a callback as an object.
     *
     * The options created will replace the current vehicle menu options.
     *
     * If you don't return any option, the options won't be replaced.
     *
     * Example:
     *
     * ```ts
     * function hoodOption(
     *     player: alt.Player,
     *     vehicle: alt.Vehicle,
     *     options: Array<IWheelOptionExt>
     * ) {
     *     options.push({
     *       name: 'Hood',
     *       callback: () => {
     *           console.log('Open the hood!');
     *       },
     *   });
     * }
     *
     * VehicleMenu.addVehicleMenuInjections(hoodOption)
     * ```
     *
     * @static
     * @param {(player: alt.Player, vehicle: alt.Vehicle, options?: Array<IWheelOptionExt>) => Array<IWheelOptionExt> | void} callback
     * @returns {(Array<IWheelOptionExt>|void)} - the actual array of IWheelOptionExt if not void
     * @memberof VehicleMenu
     */
    static addVehicleMenuInjections(
        callback: (
            player: alt.Player,
            vehicle: alt.Vehicle,
            options?: Array<IWheelOptionExt>,
        ) => Array<IWheelOptionExt> | void,
    ) {
        vehicleMenuInjections.push(callback);
    }

    static openMenu(vehicle: alt.Vehicle) {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!vehicle || !vehicle.valid) {
            return;
        }

        const dist = distance(alt.Player.local.pos, vehicle.pos);
        if (dist >= 4) {
            return;
        }

        let options: Array<IWheelOptionExt> = [];

        if (!alt.Player.local.vehicle) {
            const isDestroyed = native.getVehicleEngineHealth(vehicle.scriptID) <= 0;
            const isLocked = native.getVehicleDoorLockStatus(vehicle.scriptID) === 2;

            options.push({
                name: isLocked ? 'Unlock' : 'Lock',
                color: isLocked ? 'green' : 'red',
                icon: isLocked ? 'icon-lock-open' : 'icon-lock',
                emitServer: VEHICLE_EVENTS.SET_LOCK,
            });

            // Not Pushing & Vehicle is Currently Unlocked
            if (!PushVehicle.isPushing() && !isLocked && !isDestroyed) {
                options.push({
                    name: 'Push',
                    callback: PushVehicle.start,
                    data: [vehicle],
                });

                options.push({
                    name: 'Open Storage',
                    callback: () => {
                        alt.emitServer(VEHICLE_EVENTS.OPEN_STORAGE, vehicle);
                    },
                });
            } else {
                options.push({
                    name: 'Stop Push',
                    callback: PushVehicle.clear,
                });
            }

            for (const callback of vehicleMenuInjections) {
                try {
                    const tempOptions = callback(alt.Player.local, vehicle, options);
                    if (tempOptions) {
                        options = tempOptions;
                    }
                } catch (err) {
                    console.warn(`Got Vehicle Menu Injection Error for Player: ${err}`);
                    continue;
                }
            }
        } else {
            const engineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);

            options.push({
                name: engineOn ? 'Off' : 'On',
                icon: 'icon-engine-fill',
                color: engineOn ? 'red' : 'green',
                emitServer: VEHICLE_EVENTS.SET_ENGINE,
            });
        }

        WheelMenu.open('Vehicle Options', options);
    }

    static init() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.VEHICLE_OPTIONS,
            singlePress: VehicleMenu.openMenu,
        });
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, VehicleMenu.init);
