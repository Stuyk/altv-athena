import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import VehicleTuning from '@AthenaShared/interfaces/vehicleTuning.js';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState.js';
import VehicleExtra from '@AthenaShared/interfaces/vehicleExtra.js';
import IVehicleMod from '@AthenaShared/interfaces/vehicleMod.js';

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
 * @return {Array<VehicleExtra>}
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
 * @param {Array<VehicleExtra>} extras
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
            if (mod.id === 23 && mod.value !== 0) {
                vehicle.setWheels(23, mod.value);
            } else if (mod.id === 24 && mod.value !== 0) {
                vehicle.setWheels(24, mod.value);
            } else {
                vehicle.setMod(mod.id, mod.value);
            }
        }
    }
}

/**
 * Get all mods of the specified vehicle.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @returns {VehicleTuning}
 */
export function getTuning(vehicle: alt.Vehicle): VehicleTuning {
    if (Overrides.getTuning) {
        return Overrides.getTuning(vehicle);
    }

    let tuningData: VehicleTuning = { modkit: vehicle.modKit, mods: [] };

    for (let id = 0; id < 67; ++id) {
        let value = vehicle.getMod(id);
        if (id === 23) {
            tuningData.mods.push({ id, value: vehicle.frontWheels });
        } else if (id === 24) {
            tuningData.mods.push({ id, value: vehicle.rearWheels });
        } else {
            tuningData.mods.push({ id, value });
        }
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
            let value = vehicle.getMod(i);
            if (i === 23) {
                mods.push({ id: i, value: vehicle.frontWheels });
            } else if (i === 24) {
                mods.push({ id: i, value: vehicle.rearWheels });
            } else {
                mods.push({ id: i, value });
            }
        } catch (err) {}
    }

    return mods;
}

interface VehicleTuningFuncs {
    applyState: typeof applyState;
    setExtra: typeof setExtra;
    getExtras: typeof getExtras;
    applyTuning: typeof applyTuning;
    getTuning: typeof getTuning;
    applyMods: typeof applyMods;
    getMods: typeof getMods;
}

const Overrides: Partial<VehicleTuningFuncs> = {};

export function override(functionName: 'applyState', callback: typeof applyState);
export function override(functionName: 'setExtra', callback: typeof setExtra);
export function override(functionName: 'getExtras', callback: typeof getExtras);
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
