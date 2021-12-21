import * as alt from 'alt-server';
import { Vector3 } from '../../shared/interfaces/vector';
import { distance } from '../../shared/utility/vector';

/**
 * SERVER ONLY
 * Gets the direction the player is facing.
 * @param {Vector3} rot
 */
export function getForwardVector(rot: Vector3): Vector3 {
    return {
        x: fwdX(rot.x, rot.z),
        y: fwdY(rot.x, rot.z),
        z: fwdZ(rot.x),
    } as Vector3;
}

/**
 * SERVER ONLY
 * Return a position in front of a player based on distance.
 * @export
 * @param {alt.Player} player
 * @param {number} distance
 * @return {*}  {Vector3}
 */
export function getVectorInFrontOfPlayer(player: alt.Player, distance: number): Vector3 {
    const forwardVector = getForwardVector(player.rot);
    const posFront = {
        x: player.pos.x + forwardVector.x * distance,
        y: player.pos.y + forwardVector.y * distance,
        z: player.pos.z,
    };

    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
}

/**
 * Determine if a vector is between vectors.
 * @param {Vector3} pos
 * @param {Vector3} vector1
 * @param {Vector3} vector2
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
 * @param {Vector3} rot player rotation
 * @param {Array<{ pos: Vector3; valid?: boolean }>} entities
 * @param {number} distance
 * @return {*}  {(T | null)}
 */
export function getClosestEntity<T>(
    playerPosition: Vector3,
    rot: Vector3,
    entities: Array<{ pos: Vector3; valid?: boolean }>,
    dist: number,
    checkBackwards: boolean = false,
): T | null {
    const fwdVector = getForwardVector(rot);
    let position;

    if (!checkBackwards) {
        position = {
            x: playerPosition.x + fwdVector.x * dist,
            y: playerPosition.y + fwdVector.y * dist,
            z: playerPosition.z,
        };
    } else {
        position = {
            x: playerPosition.x - fwdVector.x * dist,
            y: playerPosition.y - fwdVector.y * dist,
            z: playerPosition.z,
        };
    }

    let lastRange = 25;
    let closestEntity;

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        if (!entity || !entity.valid) {
            continue;
        }

        const dist = distance(position, entity.pos);
        if (dist > lastRange) {
            continue;
        }

        closestEntity = entity;
        lastRange = dist;
    }

    return closestEntity;
}

function fwdX(x: number, z: number): number {
    const num = Math.abs(Math.cos(x));
    return -Math.sin(z) * num;
}

function fwdY(x: number, z: number): number {
    const num = Math.abs(Math.cos(x));
    return Math.cos(z) * num;
}

function fwdZ(x: number): number {
    return Math.sin(x);
}
