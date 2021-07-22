import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VEHICLE_DOOR_STATE, VEHICLE_EVENTS, VEHICLE_LOCK_STATE, VEHICLE_STATE } from '../../shared/enums/vehicle';
import { AnimationFlags } from '../../shared/flags/animation';
import { VehicleData } from '../../shared/information/vehicles';
import { Task } from '../../shared/interfaces/TaskTimeline';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';
import { getPlayersByGridSpace } from '../utility/filters';
import { getClosestEntity } from '../utility/vector';

import '../views/garage';
import '../views/dealership';
import './fuel';
import { ATHENA_EVENTS_VEHICLE } from '../enums/athenaEvents';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { VEHICLE_CLASS } from '../../shared/flags/vehicleType';

/**
 * Vehicle Functionality Writeup for Server / Client
 *
 * Engine(s):
 * The functionality of the vehicle engine can be triggered on either client or server-side.
 * The variable for the engine on server-side is always updated when using a task.
 * Which means the engine can be controlled from client-side via tasks.
 *
 * The engine toggle automatically sets all door(s) to false to prevent buggy code.
 *
 * Seat(s):
 * Seats on server-side are different than client-side.
 * Meaning the numbers differ from server-side and client-side.
 * Server-side seats start at 1. (Driver)
 * Client-side seats start at -1. (Driver)
 *
 * So to get the proper seat for a native on server-side you must subtract 2.
 * So if they enter a seat on server-side their seat is 1.
 * However, if you want that seat to work on client-side you subtract 2.
 * Thus resulting in -1 for the seat.
 *
 * The loops used the code below take into account that -1 is the starting client-side seat.
 *
 * Door(s):
 * Doors start at 0 and at at the maximum amount of doors / seats in the vehicle.
 * Not always true for seats because of vehicles like a bus that have like 12 seats or whatever.
 *
 * So technically if you're opening a door based on seat it's (seat + 1) for client and (seat - 1) for server.
 *
 * Toggling a door on client-side does not affect the door on sever-side.
 *
 * The behavior of doors is dependent on who is sitting in the seat next to it.
 *
 * The door itself cannot be opened with the vehicle being unlocked.
 *
 * Due to GTA:V's default settings when a player is sitting in a seat and a door is opened,
 * the door itself will always be shut by the passenger. It is best not to toggle the door
 * from the inside.
 */

export class VehicleFunctions {
    /**
     * Called when a player interacts with a vehicle.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof VehicleFunctions
     */
    static handleAction(player: alt.Player) {
        if (player.vehicle) {
            VehicleFunctions.handleInVehicle(player);
            return;
        }

        const vehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 5);

        if (!vehicle || !vehicle.valid) {
            return;
        }

        VehicleFunctions.handleOutsideVehicle(player, vehicle);
    }

    /**
     * Called when the player is outside of the vehicle they are closest to.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFunctions
     */
    static handleOutsideVehicle(player: alt.Player, vehicle: alt.Vehicle) {
        if (player.isPushingVehicle) {
            VehicleFunctions.stopPush(player);
        }

        if (VehicleFunctions.isVehicleLocked(vehicle)) {
            playerFuncs.emit.notification(player, `~r~Vehicle is not currently unlocked.`);
            return;
        }

        VehicleFunctions.prunePassengers(vehicle);

        const seat = VehicleFunctions.findOpenSeat(vehicle);
        if (seat === null) {
            playerFuncs.emit.notification(player, '~r~Could not find an open seat.');
            return;
        }

        const tasks: Array<Task> = [
            // native.taskEnterVehicle(alt.Player.local.scriptID, closestVehicle.scriptID, 2000, i - 1, 2, 1, 0);
            {
                nativeName: 'clearPedTasksImmediately',
                params: [],
                timeToWaitInMs: 100
            },
            {
                nativeName: 'taskEnterVehicle',
                params: [2000, seat, 2, 1, 0],
                timeToWaitInMs: 2000
            }
        ];
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks, vehicle);
    }

    /**
     * Check if a vehicle is locked.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFunctions
     */
    static isVehicleLocked(vehicle: alt.Vehicle): boolean {
        if (!vehicle || !vehicle.valid) {
            return false;
        }

        return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
    }

    /**
     * Called when a player is already inside of a vehicle and hit the interaction button.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof VehicleFunctions
     */
    static handleInVehicle(player: alt.Player) {
        const vehicle = player.vehicle;
        if (!vehicle || !vehicle.valid) {
            return;
        }

        if (VehicleFunctions.isVehicleLocked(vehicle)) {
            if (!vehicle.data) {
                return;
            }

            // Check the vehicle class.
            // Check if the vehicle class should allow getting off while locked.
            // Counts for motorcycles and cycle types.
            const vehicleData = VehicleData.find((x) => x.name === vehicle.data.model);
            if (!vehicleData) {
                return;
            }

            if (vehicleData.class !== VEHICLE_CLASS.CYCLE && vehicleData.class !== VEHICLE_CLASS.MOTORCYCLE) {
                return;
            }
        }

        const tasks: Array<Task> = [
            //   native.taskLeaveAnyVehicle(alt.Player.local.scriptID, 0, 0);
            {
                nativeName: 'taskLeaveAnyVehicle',
                params: [0, 0],
                timeToWaitInMs: 0
            }
        ];

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
    }

    /**
     * Checks the passengers in a vehicle and removes invalid passengers.
     * @static
     * @memberof VehicleFunctions
     */
    static prunePassengers(vehicle: alt.Vehicle) {
        if (!vehicle.passengers) {
            vehicle.passengers = [];
        }

        for (let i = vehicle.passengers.length - 1; i >= 0; i--) {
            const passenger = vehicle.passengers[i];

            // Check if the passenger is valid in the first place.
            if (!passenger || !passenger.player || !passenger.player.valid || !passenger.player.vehicle) {
                vehicle.passengers.splice(i, 1);
                continue;
            }

            // Check if the vehicle is the same vehicle or not.
            if (passenger.player.vehicle.id !== vehicle.id) {
                vehicle.passengers.splice(i, 1);
                continue;
            }
        }
    }

    /**
     * Find an open seat for the vehicle.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFunctions
     */
    static findOpenSeat(vehicle: alt.Vehicle): number {
        const vehicleData = VehicleData.find((x) => alt.hash(x.name) === vehicle.model);
        if (!vehicleData) {
            return null;
        }

        // Start at -1 for driver.
        // Check if the passengers array contains the seat.
        // If it does not contain the seat. Use it.

        for (let i = -1; i < vehicleData.seats; i++) {
            const index = vehicle.passengers.findIndex((x) => x.seat === i);

            // Means the seat is not open.
            if (index !== -1) {
                continue;
            }

            return i;
        }

        return null;
    }

    /**
     * Called when the player is attempting to enter a vehicle.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {number} seat
     * @memberof VehicleFunctions
     */
    static entering(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
        // Clear the enter state for the vehicle if the door is locked.
        if (VehicleFunctions.isVehicleLocked(vehicle)) {
            const tasks: Array<Task> = [
                //   native.clearPedTasksImmediately(alt.Player.local.scriptID);
                {
                    nativeName: 'clearPedTasksImmediately',
                    params: [],
                    timeToWaitInMs: 0
                }
            ];

            alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
            return;
        }
    }

    /**
     * Called when a player has entered and sat down in a vehicle.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {number} seat
     * @memberof VehicleFunctions
     */
    static enter(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
        const index = vehicle.passengers.findIndex((p) => p.player && p.player.id === player.id);

        if (index !== -1) {
            return;
        }

        // Handle setting the driver when entering from the passenger side.
        // Since alt:V doesn't tell us what seat they slide over to.
        if (!vehicle.driver && seat === 2) {
            vehicle.passengers.push({ player, seat: -1 });
            return;
        }

        vehicle.passengers.push({ player, seat: seat - 2 }); // Subtract 2 from seat for client-side handling.
    }

    /**
     * Called when a player has left the vehicle.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {number} seat
     * @memberof VehicleFunctions
     */
    static leave(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
        VehicleFunctions.prunePassengers(vehicle);

        // Prune Temporary Vehicles
        if (!vehicle.isTemporary) {
            return;
        }

        if (seat !== 1) {
            return;
        }

        vehicle.destroy();
    }

    /**
     * Called when a player hits the toggle engine key.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof VehicleFunctions
     */
    static toggleEngine(player: alt.Player) {
        if (!player || !player.vehicle || !player.vehicle.driver) {
            return;
        }

        if (player.vehicle.driver.id !== player.id) {
            return;
        }

        if (!vehicleFuncs.getter.isOwner(player.vehicle, player)) {
            playerFuncs.emit.notification(player, `~r~You do not have keys for this vehicle.`);
            return;
        }

        // Setting the engine client-side appears to change the server-side variable.
        // Meaning that it's okay to use the native to toggle these things.
        const tasks: Array<Task> = [
            //   native.setVehicleEngineOn(vehicle.scriptID, onOrOff, instant, autostart);
            {
                nativeName: 'setVehicleEngineOn',
                params: [!player.vehicle.engineOn, false, false],
                timeToWaitInMs: 0
            }
        ];

        // Force close vehicle doors on state change.
        Object.keys(VEHICLE_DOOR_STATE).forEach((key, index) => {
            player.vehicle.setStreamSyncedMeta(VEHICLE_DOOR_STATE[key], false);
        });

        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks, player.vehicle, true);

        // Custom Engine Event
        alt.nextTick(() => {
            alt.emit(ATHENA_EVENTS_VEHICLE.ENGINE_STATE_CHANGE, player.vehicle);
        });
    }

    /**
     * Toggle door based if vehicle is locked.
     * @static
     * @param {alt.Vehicle} vehicle
     * @param {number} doorNumber
     * @memberof VehicleFunctions
     */
    static toggleDoor(player: alt.Player, doorNumber: number) {
        const vehicle = player.vehicle
            ? player.vehicle
            : getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 5);
        if (!vehicle) {
            return;
        }

        let doorState;

        switch (doorNumber) {
            case 0:
                doorState = VEHICLE_DOOR_STATE.DOOR_DRIVER;
                break;
            case 1:
                doorState = VEHICLE_DOOR_STATE.DOOR_PASSENGER;
                break;
            case 2:
                doorState = VEHICLE_DOOR_STATE.DOOR_DRIVER_REAR;
                break;
            case 3:
                doorState = VEHICLE_DOOR_STATE.DOOR_PASSENGER_REAR;
                break;
            case 4:
                doorState = VEHICLE_DOOR_STATE.DOOR_HOOD;
                break;
            case 5:
                doorState = VEHICLE_DOOR_STATE.DOOR_TRUNK;
                break;
            default:
                doorState = null;
                break;
        }

        if (!doorState) {
            return;
        }

        const newValue = vehicle.hasStreamSyncedMeta(doorState) ? !vehicle.getStreamSyncedMeta(doorState) : true;

        // Prevent opening doors while the vehicle is locked.
        if (newValue && (vehicle.lockState as number) !== VEHICLE_LOCK_STATE.UNLOCKED) {
            return;
        }

        vehicle.setStreamSyncedMeta(doorState, newValue);
    }

    /**
     * Toggle the lock based on if a player inside or outside a vehicle.
     * Finds the closest vehicle if outside.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof VehicleFunctions
     */
    static toggleLock(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        const vehicle = player.vehicle
            ? player.vehicle
            : getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 5);
        if (!vehicle) {
            return;
        }

        if (!vehicleFuncs.getter.isOwner(vehicle, player)) {
            playerFuncs.emit.notification(player, `~r~You do not have keys for this vehicle.`);
            return;
        }

        // Update Vehicle Lock State
        vehicle.lockState =
            (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED
                ? VEHICLE_LOCK_STATE.UNLOCKED
                : VEHICLE_LOCK_STATE.LOCKED;

        vehicle.setStreamSyncedMeta(VEHICLE_STATE.LOCK, vehicle.lockState);

        if (!player.vehicle) {
            playerFuncs.emit.animation(
                player,
                `anim@mp_player_intmenu@key_fob@`,
                'fob_click_fp',
                AnimationFlags.UPPERBODY_ONLY | AnimationFlags.ENABLE_PLAYER_CONTROL,
                -1
            );
        }

        const soundName = vehicle.lockState === VEHICLE_LOCK_STATE.UNLOCKED ? 'car_unlock' : 'car_lock';
        const playersNearPlayer = getPlayersByGridSpace(player, 8);
        playersNearPlayer.forEach((target) => {
            playerFuncs.emit.sound3D(target, soundName, vehicle);
        });

        // Custom Lock Event
        alt.nextTick(() => {
            alt.emit(ATHENA_EVENTS_VEHICLE.LOCK_STATE_CHANGE, player.vehicle);
        });
    }

    static startPush(player: alt.Player, position: alt.Vector3): boolean {
        if (!player || !player.valid) {
            return false;
        }

        if (player.vehicle) {
            return false;
        }

        if (player.isPushingVehicle) {
            player.detach();
            return false;
        }

        const vehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 1);
        if (!vehicle || !vehicle.valid) {
            return false;
        }

        if (vehicle.driver) {
            return false;
        }

        player.isPushingVehicle = true;
        vehicle.setNetOwner(player);
        player.attachTo(vehicle, 0, 6286, position, new alt.Vector3(0, 0, 0), true, false);
        alt.emitClient(player, VEHICLE_EVENTS.PUSH, vehicle);
        return true;
    }

    static stopPush(player: alt.Player) {
        const vehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 1);

        if (vehicle && vehicle.valid) {
            vehicle.resetNetOwner();
        }

        player.isPushingVehicle = false;
        player.detach();
        alt.emitClient(player, VEHICLE_EVENTS.STOP_PUSH);
    }
}

alt.onClient(VEHICLE_EVENTS.PUSH, VehicleFunctions.startPush);
alt.onClient(VEHICLE_EVENTS.STOP_PUSH, VehicleFunctions.stopPush);
alt.onClient(VEHICLE_EVENTS.ACTION, VehicleFunctions.handleAction);
alt.onClient(VEHICLE_EVENTS.SET_LOCK, VehicleFunctions.toggleLock);
alt.onClient(VEHICLE_EVENTS.SET_ENGINE, VehicleFunctions.toggleEngine);

alt.on('playerEnteringVehicle', VehicleFunctions.entering);
alt.on('playerEnteredVehicle', VehicleFunctions.enter);
alt.on('playerLeftVehicle', VehicleFunctions.leave);
