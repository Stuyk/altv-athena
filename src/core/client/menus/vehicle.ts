import * as alt from 'alt-client';
import * as native from 'natives';
import { distance } from '../../shared/utility/vector';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WheelMenu } from '../views/wheelMenu';

type VehicleMenuInjection = (target: alt.Vehicle, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

// Push vehicle
const BLACKLISTED_VEHICLE_TYPES = [
    10, // Industrial
    13, // Cycles
    14, // Boats
    15, // Helicopters
    16, // Planes
    20, // Commercial
    21, // Trains
];

const Injections: Array<VehicleMenuInjection> = [];

export class VehicleWheelMenu {
    /**
     * Create a vehicle wheel menu injection.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {VehicleMenuInjection} callback
     * @memberof VehicleMenu
     */
    static addInjection(callback: VehicleMenuInjection) {
        Injections.push(callback);
    }

    /**
     * Open an in-vehicle menu option and add injections relevant to in-vehicle.
     *
     * @static
     * @param {alt.Vehicle} vehicle
     * @return {*}
     * @memberof VehicleWheelMenu
     */
    static openInVehicleMenu(vehicle: alt.Vehicle) {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!vehicle || !vehicle.valid) {
            return;
        }

        let options: Array<IWheelOptionExt> = [];

        const pedInDriverSeat = native.getPedInVehicleSeat(vehicle.scriptID, -1, false);

        // Is Driver Function
        if (pedInDriverSeat === alt.Player.local.scriptID) {
            const engineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);

            options.push({
                name: engineOn ? 'Off' : 'On',
                icon: 'icon-engine-fill',
                color: engineOn ? 'red' : 'green',
                emitServer: VEHICLE_EVENTS.SET_ENGINE,
            });
        }

        for (const callback of Injections) {
            try {
                options = callback(vehicle, options);
            } catch (err) {
                console.warn(`Got Vehicle Menu Injection Error ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Vehicle Options', options);
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

        const isDestroyed = native.getVehicleEngineHealth(vehicle.scriptID) <= 0;
        const isLocked = native.getVehicleDoorLockStatus(vehicle.scriptID) === 2;

        options.push({
            name: isLocked ? 'Unlock' : 'Lock',
            color: isLocked ? 'green' : 'red',
            icon: isLocked ? 'icon-lock-open' : 'icon-lock',
            emitServer: VEHICLE_EVENTS.SET_LOCK,
        });

        const type = native.getVehicleClass(vehicle);

        // Not Pushing & Vehicle is Currently Unlocked
        if (!PushVehicle.isPushing() && !isLocked && !isDestroyed) {
            if (!BLACKLISTED_VEHICLE_TYPES.includes(type)) {
                options.push({
                    name: 'Push',
                    callback: PushVehicle.start,
                    data: [vehicle],
                });
            }

            options.push({
                name: 'Open Storage',
                callback: () => {
                    alt.emitServer(VEHICLE_EVENTS.OPEN_STORAGE, vehicle);
                },
            });
        } else if (PushVehicle.isPushing()) {
            options.push({
                name: 'Stop Push',
                callback: PushVehicle.clear,
            });
        }

        for (const callback of Injections) {
            try {
                options = callback(vehicle, options);
            } catch (err) {
                console.warn(`Got Vehicle Menu Injection Error ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Vehicle Options', options);
    }
}
