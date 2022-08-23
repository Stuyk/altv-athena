import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { ATHENA_EVENTS_VEHICLE } from '../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import {
    Vehicle_Behavior,
    VEHICLE_DOOR_STATE,
    VEHICLE_EVENTS,
    VEHICLE_LOCK_STATE,
    VEHICLE_STATE,
} from '../../shared/enums/vehicle';
import { ANIMATION_FLAGS } from '../../shared/flags/animationFlags';
import { VehicleData } from '../../shared/information/vehicles';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { Collections } from '../interface/iDatabaseCollections';
import { getClosestEntity } from '../utility/vector';
import { StorageView } from '../views/storage';
import { StorageSystem } from './storage';
import { VEHICLE_RULES } from '../../shared/enums/vehicleRules';
import { IResponse } from '../../shared/interfaces/iResponse';
import IVehicleRuleData from '../../shared/interfaces/iVehicleRuleData';
import SystemRules from './rules';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { VehicleEvents } from '../events/vehicleEvents';
import { playerConst } from '../api/consts/constPlayer';

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

/**
 * Custom rules that can be extended and are triggered before invoking the rest of the function.
 *
 */
const rules: {
    [key: string]: Array<(player: alt.Player, vehicle: alt.Vehicle, data?: IVehicleRuleData) => IResponse>;
} = {
    [VEHICLE_RULES.ENTER]: [],
    [VEHICLE_RULES.EXIT]: [],
    [VEHICLE_RULES.LOCK]: [],
    [VEHICLE_RULES.UNLOCK]: [],
    [VEHICLE_RULES.STORAGE]: [],
    [VEHICLE_RULES.ENGINE]: [],
    [VEHICLE_RULES.DOOR]: [],
};

export class VehicleSystem {
    /**
     * Initializes all vehicles on server start.
     * @static
     * @return {*}
     * @memberof VehicleSystem
     */
    static async init(): Promise<void> {
        alt.onClient(VEHICLE_EVENTS.OPEN_STORAGE, VehicleSystem.storage);
        alt.onClient(VEHICLE_EVENTS.PUSH, VehicleSystem.startPush);
        alt.onClient(VEHICLE_EVENTS.STOP_PUSH, VehicleSystem.stopPush);
        alt.onClient(VEHICLE_EVENTS.SET_LOCK, VehicleSystem.toggleLock);
        alt.onClient(VEHICLE_EVENTS.SET_ENGINE, VehicleSystem.toggleEngine);

        alt.on('playerEnteringVehicle', VehicleSystem.entering);
        alt.on('playerEnteredVehicle', VehicleSystem.enter);
        alt.on('playerLeftVehicle', VehicleSystem.leave);
        alt.on('vehicleDestroy', VehicleSystem.destroyed);

        if (!DEFAULT_CONFIG.SPAWN_ALL_VEHICLES_ON_START) {
            return;
        }

        const vehicles = await Database.fetchAllData<IVehicle>(Collections.Vehicles);
        if (vehicles.length <= 0) {
            return;
        }

        this.spawnAllVehicles(vehicles);
    }

    private static spawnAllVehicles(vehicles: Array<IVehicle>) {
        let count = 0;
        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];

            // Skip vehicles without a garage index or without a position.
            const isInGarage = vehicle.garageIndex !== undefined && vehicle.garageIndex !== null;
            if (isInGarage || !vehicle.position) {
                continue;
            }

            // Skip Unused Vehicles
            if (vehicle.lastUsed) {
                const lastUseDate = vehicle.lastUsed + DEFAULT_CONFIG.VEHICLE_SPAWN_TIMEOUT * 60000 * 60 * 24;
                if (Date.now() > lastUseDate) {
                    continue;
                }
            }

            if (!vehicle.model) {
                alt.logWarning(
                    `Vehicle with ID: ${vehicle._id.toString()} is missing multiple properties. Skipped during initialization.`,
                );
                continue;
            }

            // Skip New Vehicles
            if (vehicle.position.x === 0 && vehicle.position.y === 0 && vehicle.position.z === 0) {
                continue;
            }

            VehicleFuncs.spawn(vehicle);
            count += 1;
        }

        alt.log(`Vehicles Spawned: ${count}`);
    }

    /**
     * Add a custom rule. Each rule is checked before executing normal behavior.
     * ie. Check vehicle ownership -> check engine rules -> execute engine functionality
     *
     * Returning true means it passed the check.
     *
     * Example (seat object is optional)
     * ```ts
     * VehicleSystem.addCustomRule(VEHICLE_RULES.ENTER, (player, vehicle, { seat }) => {
     *      // Probably not a 'faction' vehicle.
     *      if (!vehicle.data) {
     *           return { status: true, response: null };
     *      }
     *
     *      // Vehicle is not a faction vehicle.
     *      if (!vehicle.data.faction) {
     *           return { status: true, response: null };
     *      }
     *
     *      // Vehicle is a faction vehicle at this point.
     *      // Player is not in a faction.
     *      if (!player.data.faction) {
     *          return { status: false, response: null };
     *      }
     *
     *      // Faction matches player's faction.
     *      if (player.data.faction === vehicle.data.faction) {
     *          return { status: true, response: null };
     *      }
     *
     *      // Player is not in same faction as vehicle.
     *      return { status: false, response: 'You do not have keys for this faction vehicle.' };
     * });
     * ```
     *
     * @static
     * @param {VEHICLE_RULES} ruleType The rule to append the check to
     * @param {(player: alt.Player, vehicle: alt.Vehicle, seat?: number) => IResponse} callback A function that receives player, vehicle, etc.
     * @memberof VehicleSystem
     */
    static addCustomRule(
        ruleType: VEHICLE_RULES,
        callback: (player: alt.Player, vehicle: alt.Vehicle, data?: IVehicleRuleData) => IResponse,
    ) {
        if (!rules[ruleType]) {
            alt.logError(`${ruleType} does not exist for Vehicle Rules`);
            return;
        }

        rules[ruleType].push(callback);
    }

    /**
     * When a player enters a vehicle, stop the vehicle from being pushed.
     * @param {alt.Player} player - The player who entered the vehicle.
     * @param {alt.Vehicle} vehicle - The vehicle that the player is entering.
     * @returns The vehicle that the player is pushing.
     */
    static entering(player: alt.Player, _vehicle: alt.Vehicle) {
        player.hasSatDown = false;

        if (!player.isPushingVehicle) {
            return;
        }

        VehicleSystem.stopPush(player);
    }

    /**
     * `enter` is called when a player enters a vehicle.
     * @param {alt.Player} player - alt.Player - The player who entered the vehicle.
     * @param {alt.Vehicle} vehicle - The vehicle that the player is sitting in.
     * @returns The vehicle.
     */
    static enter(player: alt.Player, vehicle: alt.Vehicle) {
        player.hasSatDown = true;

        if (!vehicle.isBeingPushed) {
            return;
        }

        VehicleSystem.stopPush(vehicle);
    }

    static leave(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
        if (player && player.valid) {
            player.hasSatDown = false;
        }

        if (seat === 1) {
            VehicleFuncs.update(vehicle);
        }

        // Prune Temporary Vehicles
        if (!vehicle.isTemporary || vehicle.overrideTemporaryDeletion) {
            return;
        }

        if (seat !== 1) {
            return;
        }

        alt.setTimeout(() => {
            try {
                vehicle.destroy();
            } catch (err) { }
        }, 500);
    }

    /**
     * Check if a vehicle is locked.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleSystem
     */
    static isVehicleLocked(vehicle: alt.Vehicle): boolean {
        if (!vehicle || !vehicle.valid) {
            return false;
        }

        return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
    }

    /**
     * Teleport a player into a vehicle seat.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleSystem
     */
    static setIntoVehicle(player: alt.Player, vehicle: alt.Vehicle, clientSideSeat: number = -1) {
        if (!vehicle || !vehicle.valid) {
            return;
        }

        playerConst.safe.setPosition(player, vehicle.pos.x, vehicle.pos.y, vehicle.pos.z);
        alt.emitClient(player, VEHICLE_EVENTS.SET_INTO, vehicle, clientSideSeat);
    }

    /**
     * Called when a player hits the toggle engine key.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof VehicleSystem
     */
    static toggleEngine(player: alt.Player) {
        if (!player || !player.vehicle || !player.vehicle.driver) {
            return;
        }

        if (!player.hasSatDown) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        if (player.vehicle.driver.id !== player.id) {
            return;
        }

        if (player.vehicle.engineHealth <= 0) {
            return;
        }

        if (!VehicleFuncs.hasOwnership(player, player.vehicle)) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_KEYS));
            return;
        }

        if (!SystemRules.check(VEHICLE_RULES.ENGINE, rules, player, player.vehicle)) {
            return;
        }

        alt.emitClient(player, SYSTEM_EVENTS.VEHICLE_ENGINE, !player.vehicle.engineOn);

        // Force close vehicle doors on state change.
        Object.keys(VEHICLE_DOOR_STATE).forEach((key, _index) => {
            player.vehicle.setStreamSyncedMeta(VEHICLE_DOOR_STATE[key], false);
        });

        // Custom Engine Event
        alt.nextTick(() => {
            VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.ENGINE_STATE_CHANGE, player.vehicle);
        });
    }

    /**
     * Toggle door based if vehicle is locked.
     * @static
     * @param {alt.Vehicle} vehicle
     * @param {number} doorNumber
     * @memberof VehicleSystem
     */
    static toggleDoor(player: alt.Player, doorNumber: number) {
        const vehicle = player.vehicle
            ? player.vehicle
            : getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 5);

        if (!vehicle) {
            return;
        }

        if (vehicle.engineHealth <= 0) {
            return;
        }

        if (player.data.isDead) {
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

        if (!VehicleFuncs.hasOwnership(player, vehicle)) {
            return;
        }

        if (!SystemRules.check(VEHICLE_RULES.DOOR, rules, player, vehicle, { door: doorNumber })) {
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
     * @memberof VehicleSystem
     */
    static toggleLock(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        const vehicle = player.vehicle
            ? player.vehicle
            : getClosestEntity<alt.Vehicle>(player.pos, player.rot, alt.Vehicle.all, 2);
        if (!vehicle) {
            return;
        }

        if (vehicle.engineHealth <= 0) {
            return;
        }

        if (!VehicleFuncs.hasOwnership(player, vehicle)) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_KEYS));
            return;
        }

        const isLocked = (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
        const ruleToRun = isLocked ? VEHICLE_RULES.UNLOCK : VEHICLE_RULES.LOCK;

        if (!SystemRules.check(ruleToRun, rules, player, vehicle)) {
            return;
        }

        // Update Vehicle Lock State
        vehicle.lockState =
            (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED
                ? VEHICLE_LOCK_STATE.UNLOCKED
                : VEHICLE_LOCK_STATE.LOCKED;

        vehicle.setStreamSyncedMeta(VEHICLE_STATE.LOCK, vehicle.lockState);

        // Closes the storage if it was opened in the first place.
        if (vehicle.lockState === VEHICLE_LOCK_STATE.LOCKED && vehicle.data && vehicle.data.storage) {
            StorageView.forceCloseStorage(vehicle.data.storage);
        }

        if (!player.vehicle) {
            playerConst.emit.animation(
                player,
                `anim@mp_player_intmenu@key_fob@`,
                'fob_click_fp',
                ANIMATION_FLAGS.UPPERBODY_ONLY | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL,
                -1,
            );
        }

        const soundName = vehicle.lockState === VEHICLE_LOCK_STATE.UNLOCKED ? 'car_unlock' : 'car_lock';
        const playersNearPlayer = playerConst.get.playersByGridSpace(player, 8);
        playersNearPlayer.forEach((target) => {
            playerConst.emit.sound3D(target, soundName, vehicle);
        });

        // Custom Lock Event
        alt.nextTick(() => {
            VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.LOCK_STATE_CHANGE, vehicle);
        });
    }

    /**
     * Start pushing a vehicle.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vector3} position
     * @return {boolean}
     * @memberof VehicleSystem
     */
    static startPush(player: alt.Player, position: alt.Vector3): boolean {
        if (!player || !player.valid) {
            return false;
        }

        if (player.data.isDead) {
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

        if (vehicle.engineHealth <= 0) {
            return false;
        }

        const dist = distance(player.pos, vehicle.pos);
        if (dist >= 3) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_LONGER_NEAR_VEHICLE));
            return false;
        }

        if (vehicle.isBeingPushed) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_IS_ALREADY_BEING_PUSHED));
            return false;
        }

        if (vehicle.rot.x <= -2 || vehicle.rot.x >= 2) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NOT_RIGHT_SIDE_UP));
            return false;
        }

        if (vehicle.driver) {
            return false;
        }

        player.isPushingVehicle = true;
        vehicle.vehiclePusherID = player.id;
        vehicle.isBeingPushed = true;
        vehicle.setNetOwner(player);
        player.attachTo(vehicle, 0, 6286, position, new alt.Vector3(0, 0, 0), true, false);
        alt.emitClient(player, VEHICLE_EVENTS.PUSH, vehicle);
        return true;
    }

    /**
     * Stop a player from pushing a vehicle.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof VehicleSystem
     */
    static stopPush(entity: alt.Player | alt.Vehicle | number) {
        if (entity instanceof alt.Vehicle) {
            const someVehicle = entity;
            const target = alt.Player.all.find((x) => x.id === someVehicle.vehiclePusherID);
            entity = target;
        }

        if (typeof entity === 'number') {
            const target = alt.Player.all.find((x) => x.id === entity);
            entity = target;
        }

        const vehicle = getClosestEntity<alt.Vehicle>(entity.pos, entity.rot, alt.Vehicle.all, 1);

        if (vehicle && vehicle.valid) {
            vehicle.resetNetOwner();
            vehicle.isBeingPushed = false;
        }

        if (!entity || !entity.valid) {
            return;
        }

        entity.isPushingVehicle = false;
        entity.detach();
        alt.emitClient(entity, VEHICLE_EVENTS.STOP_PUSH);
    }

    /**
     * Opens or creates a storage interface for a vehicle.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @return {*}
     * @memberof VehicleSystem
     */
    static async storage(player: alt.Player, vehicle: alt.Vehicle) {
        if (!player || !player.valid || player.data.isDead) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        if (!vehicle.data || vehicle.isTemporary) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_STORAGE));
            return;
        }

        if (distance(player.pos, vehicle.pos) >= 5) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_TOO_FAR));
            playerConst.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (VehicleSystem.isVehicleLocked(vehicle)) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_TRUNK_ACCESS));
            playerConst.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!vehicle.data && !isFlagEnabled(vehicle.data.behavior, Vehicle_Behavior.NEED_KEY_TO_START)) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_STORAGE));
            playerConst.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (vehicle.engineHealth <= 0) {
            return;
        }

        const vehicleInfo = VehicleData.find(
            (x) => x.name.toLocaleLowerCase() === vehicle.data.model.toLocaleLowerCase(),
        );

        if (!vehicleInfo || !vehicleInfo.storage) {
            playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_STORAGE));
            playerConst.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!SystemRules.check(VEHICLE_RULES.STORAGE, rules, player, vehicle)) {
            return;
        }

        let storageID: string;

        // Remove array. Make it a string reference to the storage box.
        if (!vehicle.data.storage) {
            const storage = await StorageSystem.create({ cash: 0, items: [], maxSize: vehicleInfo.storage });
            vehicle.data.storage = storage._id.toString();
            await VehicleFuncs.save(vehicle, { storage: vehicle.data.storage });
            storageID = vehicle.data.storage;
        } else {
            storageID = vehicle.data.storage.toString();
        }

        StorageView.open(
            player,
            storageID,
            LocaleController.get(LOCALE_KEYS.VEHICLE_STORAGE_VIEW_NAME, vehicle.data._id),
            vehicle,
        );
    }

    /**
     * Eventually just despawns the vehicle after some time.
     *
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleSystem
     */
    static async destroyed(vehicle: alt.Vehicle) {
        if (DEFAULT_CONFIG.VEHICLE_DESPAWN_TIMEOUT <= -1) {
            VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DESTROYED, vehicle);
            return;
        } else {
            await new Promise((resolve: Function) => {
                alt.setTimeout(() => {
                    resolve();
                }, DEFAULT_CONFIG.VEHICLE_DESPAWN_TIMEOUT);
            });
        }

        if (!vehicle || !vehicle.valid) {
            return;
        }

        VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DESTROYED, vehicle);

        alt.nextTick(() => {
            if (vehicle && vehicle.valid && vehicle.data) {
                VehicleFuncs.despawn(vehicle.data.id);
                return;
            }

            try {
                vehicle.destroy();
            } catch (err) { }
        });
    }
}
