import * as alt from 'alt-server';
import { WASM, AresFunctions } from './wasmLoader';

const wasm = WASM.getFunctions<AresFunctions>('ares');

export function distance(vector1: alt.IVector3, vector2: alt.IVector3) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return wasm.AthenaMath.distance3d(vector1.x, vector1.y, vector1.z, vector2.x, vector2.y, vector2.z);
}

export function distance2d(vector1: alt.IVector3, vector2: alt.IVector3) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return wasm.AthenaMath.distance2d(vector1.x, vector1.y, vector2.x, vector2.y);
}

/**
 * SERVER ONLY
 * Gets the direction the player is facing.
 * @param {alt.Vector3} rot
 */
export function getForwardVector(rot: alt.Vector3): alt.Vector3 {
    return {
        x: wasm.AthenaMath.fwdX(rot.x, rot.z),
        y: wasm.AthenaMath.fwdY(rot.x, rot.z),
        z: wasm.AthenaMath.fwdZ(rot.x)
    } as alt.Vector3;
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
        x: wasm.AthenaMath.add(player.pos.x, wasm.AthenaMath.multiply(forwardVector.x, distance)),
        y: wasm.AthenaMath.add(player.pos.y, wasm.AthenaMath.multiply(forwardVector.y, distance)),
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
    const validX = wasm.AthenaMath.isGreater(pos.x, vector1.x) && wasm.AthenaMath.isLesser(pos.x, vector2.x);
    const validY = wasm.AthenaMath.isGreater(pos.y, vector1.y) && wasm.AthenaMath.isLesser(pos.y, vector2.y);
    return validX && validY ? true : false;
}

/**
 * Get the closest server entity type. Server only.
 * @template T
 * @param {alt.Vector3} playerPosition
 * @param {alt.Vector3} rot
 * @param {Array<{ pos: alt.Vector3; valid?: boolean }>} entities
 * @param {number} distance
 * @return {*}  {(T | null)}
 */
export function getClosestEntity<T>(
    playerPosition: alt.Vector3,
    rot: alt.Vector3,
    entities: Array<{ pos: alt.Vector3; valid?: boolean }>,
    distance: number
): T | null {
    const fwdVector = getForwardVector(rot);
    const position = {
        x: wasm.AthenaMath.add(playerPosition.x, wasm.AthenaMath.multiply(fwdVector.x, distance)),
        y: wasm.AthenaMath.add(playerPosition.y, wasm.AthenaMath.multiply(fwdVector.y, distance)),
        z: playerPosition.z
    };

    let lastRange = 25;
    let closestEntity;

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        if (!entity || !entity.valid) {
            continue;
        }

        const dist = distance2d(position, entity.pos);
        if (wasm.AthenaMath.isGreater(dist, lastRange)) {
            continue;
        }

        closestEntity = entity;
        lastRange = dist;
    }

    return closestEntity;
}
