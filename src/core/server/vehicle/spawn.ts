import * as alt from 'alt-server';
import * as tempVehicles from './tempVehicles';
import * as tuning from './tuning';
import { VehicleSpawnInfo } from './shared';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';

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
    tempVehicles.add(vehicle, { deleteOnLeave });

    if (vehicleInfo.data) {
        tuning.applyState(vehicle, vehicleInfo.data);
    }

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
    tempVehicles.add(vehicle, { owner: player.id, deleteOnLeave });

    if (vehicleInfo.data) {
        tuning.applyState(vehicle, vehicleInfo.data);
    }

    return vehicle;
}

/**
 * Spawn a saved vehicle that belongs to a player.
 *
 * @param {IVehicle} document
 * @return {alt.Vehicle}
 */
export function persistent(document: OwnedVehicle): alt.Vehicle {
    const vehicle = new alt.Vehicle(document.model, document.pos, document.rot);

    if (document.state) {
        tuning.applyState(vehicle, document.state);
    }

    return vehicle;
}
