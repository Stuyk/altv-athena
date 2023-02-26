import * as alt from 'alt-server';

import Database from '@stuyk/ezmongodb';
import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle';

// import { ATHENA_EVENTS_VEHICLE } from '../../shared/enums/athenaEvents';
// import { SYSTEM_EVENTS } from '../../shared/enums/system';
// import { VEHICLE_DOOR_STATE, VEHICLE_EVENTS, VEHICLE_LOCK_STATE, VEHICLE_STATE } from '../../shared/enums/vehicle';
// import { ANIMATION_FLAGS } from '../../shared/flags/animationFlags';
// import { distance } from '../../shared/utility/vector';
// import { DEFAULT_CONFIG } from '../athena/main';
// import { Collections } from '../database/collections';
// import { getClosestEntity } from '../utility/vector';
// import { VEHICLE_RULES } from '../../shared/enums/vehicleRules';
// import { LocaleController } from '../../shared/locale/locale';
// import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
// import { VehicleEvents } from '../events/vehicleEvents';
// import { playerConst } from '../api/consts/constPlayer';
// import * as Athena from '@AthenaServer/api';
// import { VehicleInfo } from '@AthenaShared/interfaces/vehicleInfo';
// import { VehicleState } from '@AthenaShared/interfaces/vehicleState';
// import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';

// // export class VehicleSystem {
// //     /**
// //      * Initializes all vehicles on server start.
// //      * @static
// //      * @return {*}
// //      * @memberof VehicleSystem
// //      */
// //     static async init(): Promise<void> {
// //         if (!DEFAULT_CONFIG.SPAWN_ALL_VEHICLES_ON_START) {
// //             return;
// //         }

// //         const vehicles = await Database.fetchAllData<IVehicle>(Collections.Vehicles);
// //         if (vehicles.length <= 0) {
// //             return;
// //         }

// //         VehicleSystem.spawnAllVehicles(vehicles);
// //     }

// //     private static spawnAllVehicles(vehicles: Array<IVehicle>) {
// //         let count = 0;
// //         for (let i = 0; i < vehicles.length; i++) {
// //             const vehicle = vehicles[i];

// //             // Skip vehicles without a garage index or without a position.
// //             const isInGarage = vehicle.garageIndex !== undefined && vehicle.garageIndex !== null;
// //             if (isInGarage || !vehicle.position) {
// //                 continue;
// //             }

// //             // Skip Unused Vehicles
// //             if (vehicle.lastUsed) {
// //                 const lastUseDate = vehicle.lastUsed + DEFAULT_CONFIG.VEHICLE_SPAWN_TIMEOUT * 60000 * 60 * 24;
// //                 if (Date.now() > lastUseDate) {
// //                     continue;
// //                 }
// //             }

// //             if (!vehicle.model) {
// //                 alt.logWarning(
// //                     `Vehicle with ID: ${vehicle._id.toString()} is missing multiple properties. Skipped during initialization.`,
// //                 );
// //                 continue;
// //             }

// //             // Skip New Vehicles
// //             if (vehicle.position.x === 0 && vehicle.position.y === 0 && vehicle.position.z === 0) {
// //                 continue;
// //             }

// //             VehicleFuncs.spawn(vehicle);
// //             count += 1;
// //         }

// //         alt.log(`Vehicles Spawned: ${count}`);
// //     }

// //     /**
// //      * Check if a vehicle is locked.
// //      * @static
// //      * @param {alt.Vehicle} vehicle
// //      * @memberof VehicleSystem
// //      */
// //     static isVehicleLocked(vehicle: alt.Vehicle): boolean {
// //         if (!vehicle || !vehicle.valid) {
// //             return false;
// //         }

// //         return (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
// //     }

// //     /**
// //      * Teleport a player into a vehicle seat.
// //      * @static
// //      * @param {alt.Player} player
// //      * @param {alt.Vehicle} vehicle
// //      * @memberof VehicleSystem
// //      */
// //     static setIntoVehicle(player: alt.Player, vehicle: alt.Vehicle, clientSideSeat: number = -1) {
// //         if (!vehicle || !vehicle.valid) {
// //             return;
// //         }

// //         playerConst.safe.setPosition(player, vehicle.pos.x, vehicle.pos.y, vehicle.pos.z);
// //         alt.emitClient(player, VEHICLE_EVENTS.SET_INTO, vehicle, clientSideSeat);
// //     }

// //     /**
// //      * Called when a player hits the toggle engine key.
// //      * @static
// //      * @param {alt.Player} player
// //      * @return {*}
// //      * @memberof VehicleSystem
// //      */
// //     static toggleEngine(player: alt.Player) {
// //         if (!player || !player.vehicle || !player.vehicle.driver) {
// //             return;
// //         }

// //         if (!player.hasSatDown) {
// //             return;
// //         }

// //         const data = Athena.document.character.get(player);
// //         if (typeof data === 'undefined') {
// //             return;
// //         }

// //         if (data.isDead) {
// //             return;
// //         }

// //         if (player.vehicle.driver.id !== player.id) {
// //             return;
// //         }

// //         if (player.vehicle.engineHealth <= 0) {
// //             return;
// //         }

// //         if (!VehicleFuncs.hasOwnership(player, player.vehicle)) {
// //             playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_KEYS));
// //             return;
// //         }

// //         if (!SystemRules.check(VEHICLE_RULES.ENGINE, rules, player, player.vehicle)) {
// //             return;
// //         }

// //         const newState = !player.vehicle.engineOn;
// //         alt.emitClient(player, SYSTEM_EVENTS.VEHICLE_ENGINE, newState);
// //         playerConst.emit.notification(player, newState ? 'Engine Started' : 'Engine Stopped');

// //         // Force close vehicle doors on state change.
// //         Object.keys(VEHICLE_DOOR_STATE).forEach((key, _index) => {
// //             player.vehicle.setStreamSyncedMeta(VEHICLE_DOOR_STATE[key], false);
// //         });

// //         // Custom Engine Event
// //         alt.nextTick(() => {
// //             VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.ENGINE_STATE_CHANGE, player.vehicle);
// //         });
// //     }

// //     /**
// //      * Toggle door based if vehicle is locked.
// //      * @static
// //      * @param {alt.Vehicle} vehicle
// //      * @param {number} doorNumber
// //      * @memberof VehicleSystem
// //      */
// //     static toggleDoor(player: alt.Player, doorNumber: number) {
// //         const vehicle = player.vehicle
// //             ? player.vehicle
// //             : getClosestEntity<alt.Vehicle>(player.pos, player.rot, [...alt.Vehicle.all], 5);

// //         if (!vehicle) {
// //             return;
// //         }

// //         if (vehicle.engineHealth <= 0) {
// //             return;
// //         }

// //         const data = Athena.document.character.get(player);
// //         if (typeof data === 'undefined') {
// //             return;
// //         }

// //         if (data.isDead) {
// //             return;
// //         }

// //         let doorState;

// //         switch (doorNumber) {
// //             case 0:
// //                 doorState = VEHICLE_DOOR_STATE.DOOR_DRIVER;
// //                 break;
// //             case 1:
// //                 doorState = VEHICLE_DOOR_STATE.DOOR_PASSENGER;
// //                 break;
// //             case 2:
// //                 doorState = VEHICLE_DOOR_STATE.DOOR_DRIVER_REAR;
// //                 break;
// //             case 3:
// //                 doorState = VEHICLE_DOOR_STATE.DOOR_PASSENGER_REAR;
// //                 break;
// //             case 4:
// //                 doorState = VEHICLE_DOOR_STATE.DOOR_HOOD;
// //                 break;
// //             case 5:
// //                 doorState = VEHICLE_DOOR_STATE.DOOR_TRUNK;
// //                 break;
// //             default:
// //                 doorState = null;
// //                 break;
// //         }

// //         if (!doorState) {
// //             return;
// //         }

// //         if (!VehicleFuncs.hasOwnership(player, vehicle)) {
// //             return;
// //         }

// //         if (!SystemRules.check(VEHICLE_RULES.DOOR, rules, player, vehicle, { door: doorNumber })) {
// //             return;
// //         }

// //         const newValue = vehicle.hasStreamSyncedMeta(doorState) ? !vehicle.getStreamSyncedMeta(doorState) : true;

// //         // Prevent opening doors while the vehicle is locked.
// //         if (newValue && (vehicle.lockState as number) !== VEHICLE_LOCK_STATE.UNLOCKED) {
// //             return;
// //         }

// //         vehicle.setStreamSyncedMeta(doorState, newValue);
// //     }

// //     /**
// //      * Toggle the lock based on if a player inside or outside a vehicle.
// //      * Finds the closest vehicle if outside.
// //      * @static
// //      * @param {alt.Player} player
// //      * @memberof VehicleSystem
// //      */
// //     static toggleLock(player: alt.Player): void {
// //         if (!player || !player.valid) {
// //             return;
// //         }

// //         const data = Athena.document.character.get(player);
// //         if (typeof data === 'undefined') {
// //             return;
// //         }

// //         if (data.isDead) {
// //             return;
// //         }

// //         const vehicle = player.vehicle
// //             ? player.vehicle
// //             : getClosestEntity<alt.Vehicle>(player.pos, player.rot, [...alt.Vehicle.all], 2);

// //         if (!vehicle) {
// //             return;
// //         }

// //         if (vehicle.engineHealth <= 0) {
// //             return;
// //         }

// //         if (!VehicleFuncs.hasOwnership(player, vehicle)) {
// //             playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_KEYS));
// //             return;
// //         }

// //         const isLocked = (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED;
// //         const ruleToRun = isLocked ? VEHICLE_RULES.UNLOCK : VEHICLE_RULES.LOCK;

// //         if (!SystemRules.check(ruleToRun, rules, player, vehicle)) {
// //             return;
// //         }

// //         // Update Vehicle Lock State
// //         vehicle.lockState =
// //             (vehicle.lockState as number) === VEHICLE_LOCK_STATE.LOCKED
// //                 ? VEHICLE_LOCK_STATE.UNLOCKED
// //                 : VEHICLE_LOCK_STATE.LOCKED;

// //         playerConst.emit.notification(player, vehicle.lockState === VEHICLE_LOCK_STATE.LOCKED ? 'Locked' : 'Unlocked');
// //         vehicle.setStreamSyncedMeta(VEHICLE_STATE.LOCK, vehicle.lockState);

// //         if (!player.vehicle) {
// //             playerConst.emit.animation(
// //                 player,
// //                 `anim@mp_player_intmenu@key_fob@`,
// //                 'fob_click_fp',
// //                 ANIMATION_FLAGS.UPPERBODY_ONLY | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL,
// //                 -1,
// //             );
// //         }

// //         const soundName = vehicle.lockState === VEHICLE_LOCK_STATE.UNLOCKED ? 'car_unlock' : 'car_lock';
// //         const players = Athena.get.players.inRange(player.pos, 8);

// //         for (let target of players) {
// //             playerConst.emit.sound3D(target, soundName, vehicle);
// //         }

// //         // Custom Lock Event
// //         alt.nextTick(() => {
// //             VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.LOCK_STATE_CHANGE, vehicle);
// //         });
// //     }

// //     /**
// //      * Start pushing a vehicle.
// //      * @static
// //      * @param {alt.Player} player
// //      * @param {alt.Vector3} position
// //      * @return {boolean}
// //      * @memberof VehicleSystem
// //      */
// //     static startPush(player: alt.Player, position: alt.Vector3): boolean {
// //         if (!player || !player.valid) {
// //             return false;
// //         }

// //         const data = Athena.document.character.get(player);
// //         if (typeof data === 'undefined') {
// //             return false;
// //         }

// //         if (data.isDead) {
// //             return false;
// //         }

// //         if (player.vehicle) {
// //             return false;
// //         }

// //         if (player.isPushingVehicle) {
// //             player.detach();
// //             return false;
// //         }

// //         const vehicle = getClosestEntity<alt.Vehicle>(player.pos, player.rot, [...alt.Vehicle.all], 1);
// //         if (!vehicle || !vehicle.valid) {
// //             return false;
// //         }

// //         if (vehicle.engineHealth <= 0) {
// //             return false;
// //         }

// //         const dist = distance(player.pos, vehicle.pos);
// //         if (dist >= 3) {
// //             playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_LONGER_NEAR_VEHICLE));
// //             return false;
// //         }

// //         if (vehicle.isBeingPushed) {
// //             playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_IS_ALREADY_BEING_PUSHED));
// //             return false;
// //         }

// //         if (vehicle.rot.x <= -2 || vehicle.rot.x >= 2) {
// //             playerConst.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NOT_RIGHT_SIDE_UP));
// //             return false;
// //         }

// //         if (vehicle.driver) {
// //             return false;
// //         }

// //         player.isPushingVehicle = true;
// //         vehicle.vehiclePusherID = player.id;
// //         vehicle.isBeingPushed = true;
// //         vehicle.setNetOwner(player);
// //         player.attachTo(vehicle, 0, 6286, position, new alt.Vector3(0, 0, 0), true, false);
// //         alt.emitClient(player, VEHICLE_EVENTS.PUSH, vehicle);
// //         return true;
// //     }

// //     /**
// //      * Stop a player from pushing a vehicle.
// //      * @static
// //      * @param {alt.Player} player
// //      * @return {*}
// //      * @memberof VehicleSystem
// //      */
// //     static stopPush(entity: alt.Player | alt.Vehicle | number) {
// //         if (entity instanceof alt.Vehicle) {
// //             const someVehicle = entity;
// //             const target = alt.Player.all.find((x) => x.id === someVehicle.vehiclePusherID);
// //             entity = target;
// //         }

// //         if (typeof entity === 'number') {
// //             const target = alt.Player.all.find((x) => x.id === entity);
// //             entity = target;
// //         }

// //         const vehicle = getClosestEntity<alt.Vehicle>(entity.pos, entity.rot, [...alt.Vehicle.all], 1);

// //         if (vehicle && vehicle.valid) {
// //             vehicle.resetNetOwner();
// //             vehicle.isBeingPushed = false;
// //         }

// //         if (!entity || !entity.valid) {
// //             return;
// //         }

// //         entity.isPushingVehicle = false;
// //         entity.detach();
// //         alt.emitClient(entity, VEHICLE_EVENTS.STOP_PUSH);
// //     }

// //     /**
// //      * Eventually just despawns the vehicle after some time.
// //      *
// //      * @static
// //      * @param {alt.Vehicle} vehicle
// //      * @memberof VehicleSystem
// //      */
// //     static async destroyed(vehicle: alt.Vehicle) {
// //         if (DEFAULT_CONFIG.VEHICLE_DESPAWN_TIMEOUT <= -1) {
// //             VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DESTROYED, vehicle);
// //             return;
// //         } else {
// //             await new Promise((resolve: Function) => {
// //                 alt.setTimeout(() => {
// //                     resolve();
// //                 }, DEFAULT_CONFIG.VEHICLE_DESPAWN_TIMEOUT);
// //             });
// //         }

// //         if (!vehicle || !vehicle.valid) {
// //             return;
// //         }

// //         VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DESTROYED, vehicle);

// //         alt.nextTick(() => {
// //             if (vehicle && vehicle.valid && vehicle.data) {
// //                 VehicleFuncs.despawn(vehicle.data.id);
// //                 return;
// //             }

// //             try {
// //                 vehicle.destroy();
// //             } catch (err) {}
// //         });
// //     }
// // }
