import * as alt from 'alt-client';
import * as native from 'natives';
import { Timer } from '../utility/timers';
import { VEHICLE_EVENTS } from '../../shared/enums/vehicle';
import { playAnimation } from './animations';
import { ANIMATION_FLAGS } from '../../shared/flags/animationFlags';
import { handleDisablingAttacks } from '../utility/disableControls';

let interval: number | undefined;
let vehicle: alt.Vehicle;
let isPushing: boolean = false;

export class PushVehicle {
    /**
     * `start` is a function that takes a vehicle as an argument and emits a server event.
     * @param {alt.Vehicle} vehicle - The vehicle to attach the camera to.
     * @returns The vehicle's model dimensions.
     */
    static start(vehicle: alt.Vehicle) {
        if (!vehicle || !vehicle.valid) {
            return;
        }

        const [_null, min, max] = native.getModelDimensions(vehicle.model);
        const attachPosition = {
            x: 0,
            y: min.y - 0.3,
            z: min.z + 1,
        };

        alt.emitServer(VEHICLE_EVENTS.PUSH, attachPosition);
    }

    /**
     * When the player enters the pushing state, the vehicle is assigned to the variable `vehicle`
    and the pushing state is set to `true`.
     * @param {alt.Vehicle} _vehicle - The vehicle that is being pushed.
     * @returns None
     */
    static serverStart(_vehicle: alt.Vehicle) {
        // Clears animations when entering pushing state.
        native.clearPedTasksImmediately(alt.Player.local.scriptID);

        vehicle = _vehicle;
        isPushing = true;
        if (!interval) {
            interval = Timer.createInterval(PushVehicle.pushing, 0, 'push.ts');
        }
    }

    static serverStop() {
        PushVehicle.clear();
    }

    static isPushing() {
        return isPushing;
    }

    static clear() {
        if (interval) {
            Timer.clearInterval(interval);
            interval = null;
            alt.emitServer(VEHICLE_EVENTS.STOP_PUSH);
        }
        
        vehicle = null;
        isPushing = false;
    }

    static pushing() {
        if (!vehicle || !vehicle.valid) {
            PushVehicle.clear();
            return;
        }

        handleDisablingAttacks();

        native.disableControlAction(0, 32, true);
        native.disableControlAction(0, 34, true);
        native.disableControlAction(0, 9, true);

        const isPlayingAnim = native.isEntityPlayingAnim(
            alt.Player.local.scriptID,
            'missfinale_c2ig_11',
            'pushcar_offcliff_m',
            3,
        );

        // S
        if (native.isControlJustPressed(0, 8)) {
            PushVehicle.clear();
            alt.emitServer(VEHICLE_EVENTS.STOP_PUSH);
            return;
        }

        // W
        if (native.isDisabledControlPressed(0, 32)) {
            if (!isPlayingAnim) {
                playAnimation(
                    'missfinale_c2ig_11',
                    'pushcar_offcliff_m',
                    ANIMATION_FLAGS.REPEAT | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL,
                );
            }

            if (!vehicle || !vehicle.valid) {
                return;
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
}

alt.onServer(VEHICLE_EVENTS.STOP_PUSH, PushVehicle.serverStop);
alt.onServer(VEHICLE_EVENTS.PUSH, PushVehicle.serverStart);
