import * as alt from 'alt-client';
import * as native from 'natives';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { distance, getClosestVectorByPos } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { IClientWheelItem, WheelMenu } from '../utility/wheelMenu';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';

function openMenu() {
    if (isAnyMenuOpen()) {
        return;
    }

    const vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, alt.Vehicle.all, 'pos');
    if (!vehicle || !vehicle.valid) {
        return;
    }

    const dist = distance(alt.Player.local.pos, vehicle.pos);
    if (dist >= 4) {
        return;
    }

    const options: Array<IClientWheelItem> = [];

    if (!alt.Player.local.vehicle) {
        const isDestroyed = native.getVehicleEngineHealth(vehicle.scriptID) <= 0;

        // Not Pushing & Vehicle is Currently Unlocked
        if (!PushVehicle.isPushing() && native.getVehicleDoorLockStatus(vehicle.scriptID) !== 2 && !isDestroyed) {
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
                callback: PushVehicle.clear
            }); 
        }
    }

    WheelMenu.create('Vehicle Options', options);
}

function init() {
    KeybindController.registerKeybind({
        key: KEY_BINDS.VEHICLE_OPTIONS,
        singlePress: openMenu,
    });
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, init);
