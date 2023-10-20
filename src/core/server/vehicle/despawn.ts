import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

/**
 * Despawns all vehicles, except for vehicles flagged to prevent despawning.
 *
 * May take some time to despawn, and save all vehicle data.
 *
 * Wait for this function to finish before attempting to respawn.
 *
 *
 */
export async function all(): Promise<void> {
    if (Overrides.all) {
        return await Overrides.all();
    }

    const vehiclesSpawned = [...alt.Vehicle.all];
    let promises = [];

    for (let vehicle of vehiclesSpawned) {
        if (!vehicle || !vehicle.valid) {
            continue;
        }

        const data = Athena.document.vehicle.get(vehicle);
        if (typeof data === 'undefined') {
            try {
                vehicle.destroy();
            } catch (err) {}

            continue;
        }

        if (data.doNotDespawn) {
            continue;
        }

        promises.push(
            new Promise(async (resolve: Function) => {
                await Athena.vehicle.controls.update(vehicle);

                Athena.document.vehicle.unbind(vehicle.id);
                try {
                    vehicle.destroy();
                } catch (err) {}

                resolve();
            }),
        );
    }

    await Promise.all(promises);
}

/**
 * Returns true if the vehicle has been despawned / destroyed.
 *
 *
 * @param {number} id
 * @return {Promise<boolean>}
 */
export async function one(id: number): Promise<boolean> {
    if (Overrides.one) {
        return await Overrides.one(id);
    }

    const vehicle = [...alt.Vehicle.all].find((x) => x.id === id);
    if (typeof vehicle === 'undefined') {
        return false;
    }

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        try {
            vehicle.destroy();
        } catch (err) {}
        return true;
    }

    if (data.doNotDespawn) {
        return false;
    }

    await Athena.vehicle.controls.update(vehicle);
    Athena.document.vehicle.unbind(vehicle.id);
    try {
        vehicle.destroy();
    } catch (err) {}
    return true;
}

/**
 * Despawn a list of vehicles by identifier
 *
 *
 * @param {Array<number>} ids
 * @return {void}
 */
export async function list(ids: Array<number>): Promise<void> {
    if (Overrides.list) {
        return await Overrides.list(ids);
    }

    const promises = [];

    for (let id of ids) {
        promises.push(one(id));
    }

    await Promise.all(ids);
}

interface VehicleDespawnFuncs {
    all: typeof all;
    one: typeof one;
    list: typeof list;
}

const Overrides: Partial<VehicleDespawnFuncs> = {};

export function override(functionName: 'all', callback: typeof all);
export function override(functionName: 'one', callback: typeof one);
export function override(functionName: 'list', callback: typeof list);
/**
 * Used to override despawn vehicle functionality
 *
 *
 * @param {keyof VehicleDespawnFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleDespawnFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
