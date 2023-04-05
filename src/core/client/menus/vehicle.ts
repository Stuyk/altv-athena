import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';

import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu';

export type VehicleMenuInjection = (target: alt.Vehicle, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

const Injections: Array<VehicleMenuInjection> = [];
let disabled = false;

/**
 * Create a vehicle wheel menu injection.
 * Meaning, a callback that will modify existing options, or append new options to the menu.
 * Must always return the original wheel menu options + your changes.
 *
 * @static
 * @param {VehicleMenuInjection} callback
 *
 */
export function addInjection(callback: VehicleMenuInjection) {
    if (Overrides.addInjection) {
        return Overrides.addInjection(callback);
    }

    Injections.push(callback);
}

/**
 * Open an in-vehicle menu option and add injections relevant to in-vehicle.
 *
 * @static
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {void}
 *
 */
export function openInVehicleMenu(vehicle: alt.Vehicle) {
    if (Overrides.openInVehicleMenu) {
        return Overrides.openInVehicleMenu(vehicle);
    }

    if (disabled) {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
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

    AthenaClient.systems.wheelMenu.open('Vehicle Options', options);
}

export function open(vehicle: alt.Vehicle) {
    if (Overrides.open) {
        return Overrides.open(vehicle);
    }

    if (disabled) {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const dist = AthenaClient.utility.vector.distance(alt.Player.local.pos, vehicle.pos);
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

    // Not Pushing & Vehicle is Currently Unlocked
    if (!isLocked && !isDestroyed) {
        for (let i = 0; i < 5; i++) {
            options.push({
                name: `Door ${i}`,
                callback: (vehicle: alt.Vehicle, door: number) => {
                    alt.emitServer(VEHICLE_EVENTS.SET_DOOR, vehicle, door);
                },
                data: [vehicle, i],
            });
        }
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

    AthenaClient.systems.wheelMenu.open('Vehicle Options', options);
}

/**
 * Disable the Vehicle Wheel Menu
 *
 * @export
 */
export function disable() {
    disabled = true;
}

interface VehicleWheelMenuFuncs {
    addInjection: typeof addInjection;
    open: typeof open;
    openInVehicleMenu: typeof openInVehicleMenu;
}

const Overrides: Partial<VehicleWheelMenuFuncs> = {};

export function override(functionName: 'addInjection', callback: typeof addInjection);
export function override(functionName: 'open', callback: typeof open);
export function override(functionName: 'openInVehicleMenu', callback: typeof openInVehicleMenu);
export function override(functionName: keyof VehicleWheelMenuFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
