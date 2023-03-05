import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';
import { VehicleSpawnInfo } from './shared';

/**
 * Spawn a temporary vehicle; it cannot be saved.
 * It is not owned by anyone.
 *
 * @param {VehicleSpawnInfo} vehicleInfo
 * @param {boolean} deleteOnLeave
 * @return {alt.Vehicle}
 */
export function temporary(vehicleInfo: VehicleSpawnInfo, deleteOnLeave = false): alt.Vehicle {
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
 * @param {alt.Player} player
 * @param {VehicleInfo} vehicleInfo
 * @param {boolean} deleteOnLeave
 * @return {alt.Vehicle}
 */
export function temporaryOwned(player: alt.Player, vehicleInfo: VehicleSpawnInfo, deleteOnLeave = false): alt.Vehicle {
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

    Athena.document.vehicle.bind(vehicle, document);
    Athena.vehicle.events.trigger('vehicle-spawned', vehicle);
    return vehicle;
}
