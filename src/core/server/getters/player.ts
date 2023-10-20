import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import Database from '@stuyk/ezmongodb';
import { Character } from '@AthenaShared/interfaces/character.js';
import { Account } from '@AthenaShared/interfaces/iAccount.js';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned.js';

/**
 * Gets an online player by account identifier based on their MongoDB account _id.
 *
 *
 * #### Example
 * ```ts
 * const player = Athena.getters.player.byAccount('123456789');
 * if (player) {
 *     console.log(`Found player ${player.id} with account ID ${player.account._id}`);
 * } else {
 *    console.log('No player found with that account ID');
 * }
 * ```
 *
 * @param {string} id
 * @return {(alt.Player | undefined)}
 */
export function byAccount(id: string): alt.Player | undefined {
    return alt.Player.all.find((p) => {
        if (!p.valid) {
            return false;
        }

        const accountData = Athena.document.account.get(p);
        if (typeof accountData === 'undefined') {
            return false;
        }

        if (accountData._id !== id) {
            return false;
        }

        return true;
    });
}

/**
 * Gets an online player by their name.
 *
 * Not case sensitive and returns the first player it finds matching that name.
 *
 * #### Example
 * ```ts
 * const player = Athena.getters.player.byName('john_fettermanjoe');
 * if (player) {
 *     console.log(`Found player ${player.id} with name ${player.name}`);
 * } else {
 *     console.log('No player found with that name');
 * }
 * ```
 *
 * @param {string} name
 * @return {(alt.Player | undefined)}
 */
export function byName(name: string): alt.Player | undefined {
    name = name.toLowerCase().replace(/\s|_+/g, ''); // Normalize 'John_Fetterman Joe' to 'john_fettermanjoe'
    return alt.Player.all.find((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        if (typeof data === 'undefined') {
            return false;
        }

        return data.name.toLowerCase().replace(/\s|_+/g, '') === name;
    });
}

/**
 * Gets an online player by their partial name.
 *
 * Not case sensitive and returns the first player it finds that includes the partial
 *
 * #### Example
 * ```ts
 * const partialName = 'john';
 * const player = Athena.getters.player.byPartialName(partialName);
 *
 * if (player) {
 *     console.log(`Found player ${player.id} with name ${player.name}`);
 * } else {
 *     console.log(`No player found with the partial name '${partialName}'`);
 * }
 * ```
 *
 * @param {string} partialName
 * @return {(alt.Player | undefined)}
 */
export function byPartialName(partialName: string): alt.Player | undefined {
    partialName = partialName.toLowerCase().replace(/\s|_+/g, ''); // Normalize 'John_Fetterman Joe' to 'john_fettermanjoe'
    return alt.Player.all.find((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        if (typeof data === 'undefined') {
            return false;
        }

        return data.name.toLowerCase().replace(/\s|_+/g, '').includes(partialName);
    });
}

/**
 * Get an online player based on their MongoDB _id
 *
 * #### Example
 * ```ts
 * const id = 'abc123jkfewfwe';
 * const player = Athena.getters.player.byDatabaseID(id);
 *
 * if (player) {
 *     console.log(`Found player with id ${id}`);
 * } else {
 *     console.log(`No player found with the id '${id}'`);
 * }
 * ```
 *
 * @param {string} id
 * @return {(alt.Player | undefined)}
 */
export function byDatabaseID(id: string): alt.Player | undefined {
    return alt.Player.all.find((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        if (typeof data === 'undefined') {
            return false;
        }

        return data._id === id;
    });
}

/**
 * Return a player based on their ID given the Identifier strategy currently setup.
 * Use this to get the player in-game that you see with your eyes.
 *
 * @param {number} id
 * @return {(alt.Player | undefined)}
 */
export function byID(id: number): alt.Player | undefined {
    return Athena.systems.identifier.getPlayer(id);
}

/**
 * Creates a temporary ColShape in front of the player.
 * The ColShape is then used to check if the entity is present within the ColShape.
 * It will keep subtract distance until it finds a player near the player that is in the ColShape.
 * Works best on flat land or very close distances.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} [startDistance=2]
 * @return {(alt.Player | undefined)}
 */
export async function inFrontOf(player: alt.Player, startDistance = 6): Promise<alt.Player | undefined> {
    const fwdVector = Athena.utility.vector.getForwardVector(player.rot);
    const closestPlayers = [...alt.Player.all].filter((p) => {
        if (p.id === player.id) {
            return false;
        }

        const dist = Athena.utility.vector.distance2d(player.pos, p.pos);
        if (dist > startDistance) {
            return false;
        }

        return true;
    });

    if (closestPlayers.length <= 0) {
        return undefined;
    }

    while (startDistance > 1) {
        for (const target of closestPlayers) {
            const fwdPos = {
                x: player.pos.x + fwdVector.x * startDistance,
                y: player.pos.y + fwdVector.y * startDistance,
                z: player.pos.z - 1,
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
 * Checks if a player is within 3 distance of a position.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.IVector3} pos A position in the world.
 */
export function isNearPosition(player: alt.Player, pos: alt.IVector3, dist = 3): boolean {
    return Athena.utility.vector.distance(player.pos, pos) <= dist;
}
/**
 * Get the current waypoint marked on a player's map.
 * Will return undefined it is not currently set.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {(alt.IVector3 | undefined)}
 */
export function waypoint(player: alt.Player): alt.IVector3 | undefined {
    return player.currentWaypoint;
}

/**
 * The player closest to a player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {(alt.Player | undefined)}
 */
export function closestToPlayer(player: alt.Player): alt.Player | undefined {
    return Athena.utility.closest.getClosestPlayer(player.pos, [player.id]);
}

/**
 * The player closest to a vehicle.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(alt.Player | undefined)}
 */
export function closestToVehicle(vehicle: alt.Vehicle): alt.Player | undefined {
    return Athena.utility.closest.getClosestPlayer(vehicle.pos);
}

/**
 * Returns the closest owned vehicle for a given player.
 * Counts any owned vehicles from other players that have supplied an injection for ownership.
 * Ignores vehicles with keyless for start.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {(alt.Vehicle | undefined)}
 */
export function closestOwnedVehicle(player: alt.Player): alt.Vehicle | undefined {
    // const vehicles = alt.Vehicle.all.filter((veh) => {
    //     if (!veh || !veh.valid || !veh.data) {
    //         return false;
    //     }

    //     if (isFlagEnabled(veh.behavior, Vehicle_Behavior.NO_KEY_TO_START)) {
    //         return false;
    //     }

    //     return VehicleFuncs.hasOwnership(player, veh);
    // });

    // if (vehicles.length <= 0) {
    //     return undefined;
    // }

    // if (vehicles.length <= 1) {
    //     return vehicles[0];
    // }

    // vehicles.sort((a, b) => {
    //     const distA = Athena.utility.vector.distance(player.pos, a.pos);
    //     const distB = Athena.utility.vector.distance(player.pos, b.pos);

    //     return distA - distB;
    // });

    // return vehicles[0];

    return undefined;
}

/**
 * Get all owned vehicles from the database for a given character.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {Promise<Array<OwnedVehicle>>}
 */
export async function ownedVehicleDocuments(player: alt.Player): Promise<Array<OwnedVehicle>> {
    const document = Athena.document.character.get(player);
    if (typeof document === 'undefined') {
        return [];
    }

    return await Database.fetchAllByField('owner', document._id, Athena.database.collections.Vehicles);
}

/**
 * Returns all characters that belong to a player.
 * Requires account info, player, or account id string.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {Promise<Array<CharacterData>>}
 */
export async function characters(playerOrAccount: alt.Player | Account | string): Promise<Array<Character>> {
    if (playerOrAccount instanceof alt.Player) {
        const accountData = Athena.document.account.get(playerOrAccount);
        if (!accountData) {
            return [];
        }

        return await Database.fetchAllByField('account_id', accountData._id, Athena.database.collections.Characters);
    }

    if (typeof playerOrAccount === 'string') {
        return await Database.fetchAllByField(
            'account_id',
            playerOrAccount.toString(),
            Athena.database.collections.Characters,
        );
    }

    return await Database.fetchAllByField(
        'account_id',
        playerOrAccount._id.toString(),
        Athena.database.collections.Characters,
    );
}

/**
 * Determine if a player is currently dead / marked as dead.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {boolean}
 */
export function isDead(player: alt.Player): boolean {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    return data.isDead ? data.isDead : false;
}

/**
 * Determine if a player is valid, and spawned as a character.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {boolean}
 */
export function isValid(player: alt.Player): boolean {
    if (!player || !player.valid) {
        return false;
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    return true;
}
