import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import VehicleTuning from '@AthenaShared/interfaces/vehicleTuning';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState';
import IVehicleMod from '@AthenaShared/interfaces/vehicleMod';

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
 * @param {VehicleTuning } tuning
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

/**
 * Apply mods to a vehicle.
 *
 * Automatically saves data if vehicle is non-temporary.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {number} modkit
 * @param {Array<IVehicleMod>} mods
 * @return {*}
 */
export async function applyMods(vehicle: alt.Vehicle, modkit: number, mods: Array<IVehicleMod>) {
    if (Overrides.applyMods) {
        return Overrides.applyMods(vehicle, modkit, mods);
    }

    const currentMods = getMods(vehicle);
    for (let mod of mods) {
        const existingIndex = currentMods.findIndex((x) => x.id === mod.id);
        if (existingIndex >= 0) {
            currentMods[existingIndex].value = mod.value;
        }

        try {
            vehicle.setMod(mod.id, mod.value);
        } catch (err) {}
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return;
    }

    const tuning: VehicleTuning = {
        modkit,
        mods: currentMods,
    };

    await Athena.document.vehicle.set(vehicle, 'tuning', tuning);
}

/**
 * Return all mods that are currently applied to a vehicle.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @return {Array<IVehicleMod>}
 */
export function getMods(vehicle: alt.Vehicle): Array<IVehicleMod> {
    const mods: Array<IVehicleMod> = [];

    for (let i = 0; i < 67; i++) {
        try {
            const value = vehicle.getMod(i);
            mods.push({ id: i, value });
        } catch (err) {}
    }

    return mods;
}

interface VehicleTuningFuncs {
    applyState: typeof applyState;
    applyTuning: typeof applyTuning;
    getTuning: typeof getTuning;
    applyMods: typeof applyMods;
    getMods: typeof getMods;
}

const Overrides: Partial<VehicleTuningFuncs> = {};

export function override(functionName: 'applyState', callback: typeof applyState);
export function override(functionName: 'applyTuning', callback: typeof applyTuning);
export function override(functionName: 'getTuning', callback: typeof getTuning);
export function override(functionName: 'applyMods', callback: typeof applyMods);
export function override(functionName: 'getMods', callback: typeof getMods);
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
