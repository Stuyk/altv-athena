import * as alt from 'alt-server';
import { IVehicle } from '../../../shared/interfaces/iVehicle';
import { Injections } from '../injections';

export enum VehicleInjectionNames {
    SPAWN_START = 'vehicle-spawn-start',
    SPAWN_END = 'vehicle-spawn-end',
    ADD_START = 'vehicle-add-start',
    ADD_END = 'vehicle-add-end',
    OWNERSHIP = 'vehicle-ownership',
    SAVE = 'vehicle-save',
    SPAWN_CHECK = 'vehicle-spawn-check',
    DESPAWN_START = 'vehicle-despawn-start',
}

type spawnTypes = `${VehicleInjectionNames.SPAWN_START}` | `${VehicleInjectionNames.SPAWN_END}`;
type addTypes = `${VehicleInjectionNames.ADD_START}` | `${VehicleInjectionNames.ADD_END}`;
type saveTypes = `${VehicleInjectionNames.SAVE}`;
type ownershipTypes = `${VehicleInjectionNames.OWNERSHIP}`;
type despawnTypes = `${VehicleInjectionNames.DESPAWN_START}`;

export type VehicleAddCallback = (vehicle: IVehicle) => IVehicle | void;
export type VehicleSaveCallback = (vehicle: IVehicle) => { [key: string]: any };
export type VehicleOwnershipCallback = (player: alt.Player, vehicle: alt.Vehicle) => boolean;
export type VehicleSpawnCallback = (document: IVehicle) => IVehicle | void;
export type VehicleDespawnCallback = (document: alt.Vehicle) => void;

/**
 * Add means it's being added to the database.
 * Adds an injection that is called when a vehicle is starting to be added, or at the end of being added.
 * Return the modified full document, or original document.
 *
 * @param {addTypes} type
 * @param {VehicleAddCallback} callback
 */
function add(type: addTypes, callback: VehicleAddCallback) {
    Injections.add(type, callback);
}

/**
 * Called when the vehicle is being despawned.
 * This is called just before the vehicle is removed from the world.
 *
 * @param {despawnTypes} type
 * @param {VehicleDespawnCallback} callback
 */
function despawn(type: despawnTypes, callback: VehicleDespawnCallback) {
    Injections.add(type, callback);
}

/**
 * Called when the vehicle is being spanwed.
 *
 * @param {spawnTypes} type
 * @param {VehicleSpawnCallback} callback
 */
function spawn(type: spawnTypes, callback: VehicleSpawnCallback) {
    Injections.add(type, callback);
}

/**
 * Add an injection when checking the vehicle's ownership.
 * Return `false` in the callback to deny entry into the vehicle.
 *
 * @param {ownershipTypes} type
 * @param {VehicleOwnershipCallback} callback
 */
function ownership(type: ownershipTypes, callback: VehicleOwnershipCallback) {
    Injections.add(type, callback);
}

/**
 * Add an injection that appends or adjusts the vehicle document.
 * Return an object document based on partial IVehicle or key value  object to combine it with the existing document.
 *
 * @param {saveTypes} type
 * @param {VehicleSaveCallback} callback
 */
function save(type: saveTypes, callback: VehicleSaveCallback) {
    Injections.add(type, callback);
}

export const VehicleInjection = {
    add,
    spawn,
    despawn,
    ownership,
    save,
};
