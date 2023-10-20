import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import * as players from './players.js';

/**
 * Get a vehicle by their alt:V ID
 *
 * @param {number} id
 * @return {(alt.Vehicle | undefined)}
 */
export function byID(id: number): alt.Vehicle | undefined {
    return alt.Vehicle.all.find((x) => x.id === id);
}

/**
 * Return a spawned vehicle by is incremental data id.
 *
 * This only works for persistent vehicles.
 *
 *
 * @param {(number | string)} id
 * @return {(alt.Vehicle | undefined)}
 */
export function byIncrementalDatabaseID(id: number | string): alt.Vehicle | undefined {
    if (typeof id === 'string') {
        id = parseInt(id);
    }

    if (isNaN(id)) {
        return undefined;
    }

    return alt.Vehicle.all.find((x) => {
        const data = Athena.document.vehicle.get(x);

        if (typeof data === 'undefined') {
            return false;
        }

        if (data.id !== id) {
            return false;
        }

        return true;
    });
}

/**
 * Get a vehicle based on their database _id
 * May return undefined if the vehicle is not currently spawned.
 *
 * @param {string} id
 * @return {(alt.Vehicle | undefined)}
 */
export function byDatabaseID(id: string): alt.Vehicle | undefined {
    return alt.Vehicle.all.find((x) => {
        const data = Athena.document.vehicle.get(x);

        if (typeof data === 'undefined') {
            return false;
        }

        if (data._id !== id) {
            return false;
        }

        return true;
    });
}

/**
 * Check if a vehicle model is currently valid.
 * Use `alt.hash` to hash a plain text model. ex: `alt.hash('infernus')`
 *
 * @param {number} model
 * @return {boolean}
 */
export function isValidModel(model: number): boolean {
    try {
        const vehicle = new alt.Vehicle(model, 0, 0, 0, 0, 0, 0);
        alt.nextTick(() => {
            vehicle.destroy();
        });
        return true;
    } catch (err) {
        return false;
    }
}
/**
 * Creates a temporary ColShape in front of the current vehicle or player.
 * The ColShape is then used to check if a vehicle is present within the ColShape.
 * It will keep subtract distance until it finds a vehicle near the player that is in the ColShape.
 * Works best on flat land or very close distances.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} [startDistance=2]
 * @return {(alt.Vehicle | undefined)}
 */
export async function inFrontOf(entity: alt.Entity, startDistance = 6): Promise<alt.Vehicle | undefined> {
    const fwdVector = Athena.utility.vector.getForwardVector(entity.rot);
    const closestVehicles = [...alt.Vehicle.all].filter((p) => {
        if (p.id === entity.id) {
            return false;
        }

        const dist = Athena.utility.vector.distance2d(entity.pos, p.pos);
        if (dist > startDistance) {
            return false;
        }

        return true;
    });

    if (closestVehicles.length <= 0) {
        return undefined;
    }

    while (startDistance > 1) {
        for (const target of closestVehicles) {
            const fwdPos = {
                x: entity.pos.x + fwdVector.x * startDistance,
                y: entity.pos.y + fwdVector.y * startDistance,
                z: entity.pos.z - 1,
            };

            const colshape = new alt.ColshapeSphere(fwdPos.x, fwdPos.y, fwdPos.z, 2);

            await alt.Utils.wait(10);

            const isInside = colshape.isEntityIn(target);
            colshape.destroy();

            if (isInside) {
                return target;
            }
        }

        startDistance -= 0.5;
    }

    return undefined;
}

/**
 * Checks if a vehicle is within 3 distance of a position.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {alt.IVector3} pos A position in the world.
 */
export function isNearPosition(vehicle: alt.Vehicle, pos: alt.IVector3, dist = 3): boolean {
    return Athena.utility.vector.distance(vehicle.pos, pos) <= dist;
}
/**
 * Returns all passengers and the driver.
 * No specific order.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {alt.Player[]}
 */
export function passengers(vehicle: alt.Vehicle): alt.Player[] {
    return players.inVehicle(vehicle);
}

/**
 * Just wraps the `vehicle.driver` lookup.
 * Returns a player if they are driving this vehicle.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(alt.Player | undefined)}
 */
export function driver(vehicle: alt.Vehicle): alt.Player | undefined {
    return vehicle.driver;
}

/**
 * The player closest to a player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {(alt.Player | undefined)}
 */
export function closestToPlayer(player: alt.Player): alt.Player | undefined {
    return Athena.utility.closest.getClosestPlayer(player.pos);
}

/**
 * The vehicle closest to a player.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(alt.Player | undefined)}
 */
export function closestToVehicle(player: alt.Player): alt.Vehicle | undefined {
    return Athena.utility.closest.getClosestVehicle(player.pos);
}
