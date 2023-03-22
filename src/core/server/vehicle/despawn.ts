import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

/**
 * Despawns all vehicles, except for vehicles flagged to prevent despawning.
 *
 * May take some time to despawn, and save all vehicle data.
 *
 * Wait for this function to finish before attempting to respawn.
 *
 * @export
 */
export async function all(): Promise<void> {
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
 * @export
 * @param {number} id
 * @return {Promise<boolean>}
 */
export async function one(id: number): Promise<boolean> {
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
 * @export
 * @param {Array<number>} ids
 * @return {*}
 */
export async function list(ids: Array<number>): Promise<void> {
    const promises = [];

    for (let id of ids) {
        promises.push(one(id));
    }

    await Promise.all(ids);
}
