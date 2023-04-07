import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';
import { VehicleSpawnInfo } from './shared';
import Database from '@stuyk/ezmongodb';

/**
 * Spawn a temporary vehicle; it cannot be saved.
 * It is not owned by anyone.
 *
 * @param {VehicleSpawnInfo} vehicleInfo
 * @param {boolean} deleteOnLeave
 * @return {alt.Vehicle}
 */
export function temporary(vehicleInfo: VehicleSpawnInfo, deleteOnLeave = false): alt.Vehicle {
    if (Overrides.temporary) {
        return Overrides.temporary(vehicleInfo, deleteOnLeave);
    }

    const vehicle = new alt.Vehicle(vehicleInfo.model, vehicleInfo.pos, vehicleInfo.rot);
    vehicle.manualEngineControl = true;

    Athena.vehicle.tempVehicles.add(vehicle, { deleteOnLeave });

    if (vehicleInfo.data) {
        Athena.vehicle.tuning.applyState(vehicle, vehicleInfo.data);
    }

    Athena.vehicle.events.trigger('vehicle-spawned', vehicle);
    return vehicle;
}

/**
 * Spawn a temporary vehicle; owned by the player.
 * Cannot be modified by the player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {VehicleSpawnInfo} vehicleInfo
 * @param {boolean} deleteOnLeave
 * @return {alt.Vehicle}
 */
export function temporaryOwned(player: alt.Player, vehicleInfo: VehicleSpawnInfo, deleteOnLeave = false): alt.Vehicle {
    if (Overrides.temporaryOwned) {
        return Overrides.temporaryOwned(player, vehicleInfo, deleteOnLeave);
    }

    const vehicle = new alt.Vehicle(vehicleInfo.model, vehicleInfo.pos, vehicleInfo.rot);
    vehicle.manualEngineControl = true;

    Athena.vehicle.tempVehicles.add(vehicle, { owner: player.id, deleteOnLeave });

    if (vehicleInfo.data) {
        Athena.vehicle.tuning.applyState(vehicle, vehicleInfo.data);
    }

    Athena.vehicle.events.trigger('vehicle-spawned', vehicle);
    return vehicle;
}

/**
 * Spawn a saved vehicle that belongs to a player.
 * Returns undefined if the vehicle is already spawned.
 *
 * @param {IVehicle} document
 * @return {alt.Vehicle | undefined}
 */
export function persistent(document: OwnedVehicle): alt.Vehicle | undefined {
    if (Overrides.persistent) {
        return Overrides.persistent(document);
    }

    document._id = document._id.toString();

    if (Athena.document.vehicle.exists(document._id.toString())) {
        return undefined;
    }

    const vehicle = new alt.Vehicle(document.model, document.pos, document.rot);
    vehicle.manualEngineControl = true;

    if (document.plate) {
        vehicle.numberPlateText = document.plate;
    }

    if (document.state) {
        Athena.vehicle.tuning.applyState(vehicle, document.state);
    }

    if (document.tuning) {
        Athena.vehicle.tuning.applyTuning(vehicle, document.tuning);
    }

    if (document.extras) {
        Athena.vehicle.tuning.setExtra(vehicle, document.extras);
    }

    if (document.damage) {
        Athena.vehicle.damage.apply(vehicle, document.damage);
    }

    Athena.document.vehicle.bind(vehicle, document);
    Athena.vehicle.events.trigger('vehicle-spawned', vehicle);
    return vehicle;
}

/**
 * Spawn all vehicles from the database.
 *
 *
 */
export async function all() {
    if (Overrides.all) {
        return Overrides.all();
    }

    const vehicles = await Database.fetchAllData<OwnedVehicle>(Athena.database.collections.Vehicles);
    for (let vehicle of vehicles) {
        if (vehicle.garageInfo) {
            continue;
        }

        persistent(vehicle);
    }
}

interface VehicleSpawnFuncs {
    all: typeof all;
    temporary: typeof temporary;
    temporaryOwned: typeof temporaryOwned;
    persistent: typeof persistent;
}

const Overrides: Partial<VehicleSpawnFuncs> = {};

export function override(functionName: 'all', callback: typeof all);
export function override(functionName: 'temporary', callback: typeof temporary);
export function override(functionName: 'temporaryOwned', callback: typeof temporaryOwned);
export function override(functionName: 'persistent', callback: typeof persistent);
/**
 * Used to override vehicle spawning functionality
 *
 *
 * @param {keyof VehicleSpawnFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleSpawnFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
