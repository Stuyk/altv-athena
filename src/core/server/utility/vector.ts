import * as alt from 'alt-server';
import { Vector3 } from 'alt-server';
import { distance2d } from '../../shared/utility/vector';

/**
 * SERVER ONLY
 * Gets the direction the player is facing.
 * @param {alt.Vector3} rot
 */
export function getForwardVector(rot: alt.Vector3): alt.Vector3 {
    const z = rot.z;
    const x = rot.x;
    const num = Math.abs(Math.cos(x));
    return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

/**
 * SERVER ONLY
 * Return a position in front of a player based on distance.
 * @export
 * @param {alt.Player} player
 * @param {number} distance
 * @return {*}  {alt.Vector3}
 */
export function getVectorInFrontOfPlayer(player: alt.Player, distance: number): alt.Vector3 {
    const forwardVector = getForwardVector(player.rot);
    const posFront = {
        x: player.pos.x + forwardVector.x * distance,
        y: player.pos.y + forwardVector.y * distance,
        z: player.pos.z
    };

    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
}

/**
 * Determine if a vector is between vectors.
 * @param {alt.Vector3} pos
 * @param {alt.Vector3} vector1
 * @param {alt.Vector3} vector2
 * @returns {boolean}
 */
export function isBetweenVectors(pos, vector1, vector2): boolean {
    const validX = pos.x > vector1.x && pos.x < vector2.x;
    const validY = pos.y > vector1.y && pos.y < vector2.y;
    return validX && validY ? true : false;
}

/**
 * Get the closest server entity type. Server only.
 * @template T
 * @param {Vector3} playerPosition
 * @param {Vector3} rot
 * @param {Array<{ pos: Vector3; valid?: boolean }>} entities
 * @param {number} distance
 * @return {*}  {(T | null)}
 */
export function getClosestEntity<T>(
    playerPosition: Vector3,
    rot: Vector3,
    entities: Array<{ pos: Vector3; valid?: boolean }>,
    distance: number
): T | null {
    const fwdVector = getForwardVector(rot);
    const position = {
        x: playerPosition.x + fwdVector.x * distance,
        y: playerPosition.y + fwdVector.y * distance,
        z: playerPosition.z
    };

    let lastRange = distance;
    let closestEntity;

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        if (!entity || (entity.hasOwnProperty('valid') && !entity.valid)) {
            continue;
        }

        if (!entity.hasOwnProperty('pos')) {
            continue;
        }

        const dist = distance2d(position, entity.pos);

        if (dist > distance) {
            continue;
        }

        if (dist > lastRange) {
            continue;
        }

        closestEntity = entity;
        lastRange = dist;
    }

    return closestEntity;
}
