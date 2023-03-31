import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import * as vehicle from './vehicle';

/**
 * Return all players currently online and logged into a character.
 *
 * @return {alt.Player[]}
 */
export function online(): alt.Player[] {
    return [...alt.Player.all].filter((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        return typeof data !== 'undefined';
    });
}

export function onlineWithWeapons(): alt.Player[] {
    return [...alt.Player.all].filter((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        if (typeof data === 'undefined') {
            return false;
        }

        if (p.currentWeapon === 0xa2719263) {
            return false;
        }

        return true;
    });
}
/**
 * Creates an array of players who are closest to a position.
 * Array is automatically sorted into ascending order.
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {number} range
 * @return {Array<{ player: alt.Player; dist: number }>}
 */
export function inRangeWithDistance(pos: alt.IVector3, range: number): Array<{ player: alt.Player; dist: number }> {
    const playersInRange: Array<{ player: alt.Player; dist: number }> = [];
    const players = [...alt.Player.all];
    for (let player of players) {
        if (!player || !player.valid) {
            continue;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            continue;
        }

        const dist = Athena.utility.vector.distance(pos, player.pos);
        if (dist > range) {
            continue;
        }

        playersInRange.push({ player, dist });
    }

    return playersInRange.sort((a, b) => {
        return a.dist - b.dist;
    });
}

/**
 * Gets all players around a specific position.
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {number} range
 * @return {alt.Player[]}
 */
export function inRange(pos: alt.IVector3, range: number): alt.Player[] {
    const players = [...alt.Player.all].filter((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        return typeof data !== 'undefined';
    });

    if (players.length <= 0) {
        return [];
    }

    return players.filter((p) => p.pos && Athena.utility.vector.distance(pos, p.pos) <= range);
}

/**
 * Gets all online players with a given name.
 *
 * @param {string} name
 * @return {alt.Player[]}
 */
export function withName(name: string): alt.Player[] {
    name = name.toLowerCase().replaceAll('_', ''); // Normalize My_Name to myname
    return alt.Player.all.filter((p) => {
        if (!p.valid) {
            return false;
        }

        const data = Athena.document.character.get(p);
        if (typeof data === 'undefined') {
            return false;
        }

        return data.name.toLowerCase().replaceAll('_', '') === name;
    });
}

/**
 * Returns all players who are currently driving a vehicle.
 *
 * @return {alt.Player[]}
 */
export function driving(): alt.Player[] {
    return alt.Player.all.filter((p) => {
        if (!p.valid || !p.vehicle || !p.vehicle.driver) {
            return false;
        }

        return p.vehicle.driver.id === p.id;
    });
}

/**
 * Return all players who are currently walking / on foot.
 *
 * @return {alt.Player[]}
 */
export function walking(): alt.Player[] {
    return alt.Player.all.filter((p) => {
        if (!p.valid || p.vehicle) {
            return false;
        }

        const data = Athena.document.character.get(p);
        return typeof data !== 'undefined';
    });
}

/**
 * Return all online players driving a specific vehicle model.
 *
 * @param {(string | number)} model
 * @return {alt.Player[]}
 */
export function drivingSpecificModel(model: string | number): alt.Player[] {
    if (typeof model === 'string') {
        model = alt.hash(model);
    }

    if (!vehicle.isValidModel(model)) {
        throw new Error(`${model} is not a valid vehicle model.`);
    }

    return alt.Player.all.filter((p) => {
        if (!p.valid || !p.vehicle || !p.vehicle.driver) {
            return false;
        }

        const data = Athena.document.character.get(p);
        if (typeof data === 'undefined') {
            return false;
        }

        if (p.vehicle.driver.id !== p.id) {
            return false;
        }

        return p.vehicle.model === model;
    });
}

/**
 * Returns all passengers and the driver.
 * No specific order.
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {alt.Player[]}
 */
export function inVehicle(vehicle: alt.Vehicle): alt.Player[] {
    return alt.Player.all.filter((x) => x.vehicle && x.vehicle.id === vehicle.id);
}
