import * as alt from 'alt-server';

import VehicleTuning from '@AthenaShared/interfaces/vehicleTuning';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState';
import VehicleExtra from '@AthenaShared/interfaces/vehicleExtra';

/**
 * Applies specified properties to a vehicle in bulk.
 * These match the alt:V API, and can be pulled from a database.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {VehicleState} data
 */
export function applyState(vehicle: alt.Vehicle, state: Partial<VehicleState> | VehicleState) {
    if (Overrides.applyState) {
        return Overrides.applyState(vehicle, state);
    }

    Object.keys(state).forEach((key) => {
        vehicle[key] = state[key];
    });
}

/**
 * Get all mods of the specified vehicle.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {VehicleTuning } tuning
 */
export function getExtras(vehicle: alt.Vehicle): Array<VehicleExtra> {
    if (Overrides.getExtras) {
        return Overrides.getExtras(vehicle);
    }

    let extraData: Array<VehicleExtra> = [];

    for (let id = 0; id < 15; ++id) {
        let state: boolean = !vehicle.getExtra(id);
        extraData.push({ id, state });
    }

    return extraData;
}

/**
 * Applies specified properties to a vehicle in bulk.
 * These match the alt:V API, and can be pulled from a database.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {VehicleState} data
 */
export function setExtra(vehicle: alt.Vehicle, extras: Array<VehicleExtra>) {
    if (Overrides.setExtra) {
        return Overrides.setExtra(vehicle, extras);
    }

    for (let extra of extras) {
        vehicle.setExtra(extra.id, extra.state);
    }
}

/**
 * Apply tuning to the specified vehicle.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {VehicleTuning | Partial<VehicleTuning>} tuning
 */
export function applyTuning(vehicle: alt.Vehicle, tuning: VehicleTuning | Partial<VehicleTuning>) {
    if (Overrides.applyTuning) {
        return Overrides.applyTuning(vehicle, tuning);
    }

    if (typeof tuning === 'undefined') {
        return;
    }

    if (tuning.modkit) {
        vehicle.modKit = tuning.modkit;
    }

    if (tuning.mods) {
        for (let mod of tuning.mods) {
            vehicle.setMod(mod.id, mod.value);
        }
    }
}

/**
 * Get all mods of the specified vehicle.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @returns
 */
export function getTuning(vehicle: alt.Vehicle): VehicleTuning {
    if (Overrides.getTuning) {
        return Overrides.getTuning(vehicle);
    }

    let tuningData: VehicleTuning = { modkit: vehicle.modKit, mods: [] };

    for (let id = 0; id < 70; ++id) {
        let value = vehicle.getMod(id);
        tuningData.mods.push({ id, value });
    }

    return tuningData;
}

interface VehicleTuningFuncs {
    applyState: typeof applyState;
    setExtra: typeof setExtra;
    getExtras: typeof getExtras;
    applyTuning: typeof applyTuning;
    getTuning: typeof getTuning;
}

const Overrides: Partial<VehicleTuningFuncs> = {};

export function override(functionName: 'applyState', callback: typeof applyState);
export function override(functionName: 'setExtra', callback: typeof setExtra);
export function override(functionName: 'getExtras', callback: typeof getExtras);
export function override(functionName: 'applyTuning', callback: typeof applyTuning);
export function override(functionName: 'getTuning', callback: typeof getTuning);
/**
 * Used to override vehicle tuning functionality
 *
 *
 * @param {keyof VehicleTuningFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleTuningFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
