import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { PedConfigFlag } from '../../shared/flags/pedflags';
import { KeybindController } from '../events/keyup';

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

    static enterVehicle() {
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableShufflingToDriverSeat, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableStartingVehEngine, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, PedConfigFlag.DisableStoppingVehEngine, true);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, VehicleController.registerKeybinds);
alt.on('enteredVehicle', VehicleController.enterVehicle);
