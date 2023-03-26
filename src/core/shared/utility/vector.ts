import * as alt from 'alt-shared';

/**
 * Get the distance between two positions.
 *
 *
 * @param {alt.IVector3} vector1
 * @param {alt.IVector3} vector2
 * @return {number}
 */
export function distance(vector1: alt.IVector3, vector2: alt.IVector3): number {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2),
    );
}

/**
 * Get the distance between two positions. Excludes z
 *
 *
 * @param {alt.IVector2} vector1
 * @param {alt.IVector2} vector2
 * @return {number}
 */
export function distance2d(vector1: alt.IVector2, vector2: alt.IVector2): number {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}

/**
 * Get the closest vector given an array of positions.
 *
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {alt.IVector3[]} arrayOfPositions
 * @return {alt.IVector3}
 */
export function getClosestVector(pos: alt.IVector3, arrayOfPositions: alt.IVector3[]) {
    arrayOfPositions.sort((a, b) => {
        return distance(pos, a) - distance(pos, b);
    });

    return arrayOfPositions[0];
}

/**
 * Get the closest Vector by position.
 *
 *
 * @template T
 * @param {alt.IVector3} pos A position in the world.
 * @param {T[]} arrayOfPositions
 * @param {string} [posVariable='pos']
 * @return {T}
 */
export function getClosestVectorByPos<T>(pos: alt.IVector3, arrayOfPositions: T[], posVariable: string = 'pos'): T {
    arrayOfPositions.sort((a, b) => {
        return distance(pos, a[posVariable]) - distance(pos, b[posVariable]);
    });

    return arrayOfPositions[0];
}

/**
 * Gets an array of the closest types.
 *
 * @template T
 * @param {alt.IVector3} pos A position in the world.
 * @param {Array<{ pos: alt.IVector3; valid: boolean }>} elements
 * @param {number} maxDistance
 * @return {Array<T>}
 */
export function getClosestTypes<T extends { pos: alt.IVector3; valid: boolean }>(
    pos: alt.IVector3,
    elements: Array<T>,
    maxDistance: number,
    mustHaveProperties: Array<string> = [],
    positionName: string = 'pos',
): Array<T> {
    const newElements: Array<T> = [];

    for (let i = 0; i < elements.length; i++) {
        if (!elements[i] || !elements[i].valid) {
            continue;
        }

        if (mustHaveProperties.length >= 1) {
            let isValid = true;
            for (let x = 0; x < mustHaveProperties.length; x++) {
                if (!elements[i][mustHaveProperties[x]]) {
                    isValid = false;
                    break;
                }
            }

            if (!isValid) {
                continue;
            }
        }

        if (distance2d(pos, elements[i][positionName]) > maxDistance) {
            continue;
        }

        newElements.push(elements[i] as T);
    }

    return newElements;
}

export function lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
}

/**
 * Finds a position between two vectors to ease into.
 * Returns a new position.
 *
 *
 * @param {alt.IVector3} start
 * @param {alt.IVector3} end
 * @param {number} l
 * @param {boolean} clamp
 * @return {alt.IVector3}
 */
export function vectorLerp(start: alt.IVector3, end: alt.IVector3, l: number, clamp: boolean): alt.IVector3 {
    if (clamp) {
        if (l < 0.0) {
            l = 0.0;
        }

        if (l > 0.0) {
            l = 1.0;
        }
    }

    let x = lerp(start.x, end.x, l);
    let y = lerp(start.y, end.y, l);
    let z = lerp(start.z, end.z, l);

    return { x: x, y: y, z: z };
}

/**
 * SERVER ONLY
 * Gets the direction the player is facing.
 * @param {alt.IVector3} rot
 */
export function getForwardVector(rot: alt.IVector3): alt.IVector3 {
    return {
        x: fwdX(rot.x, rot.z),
        y: fwdY(rot.x, rot.z),
        z: fwdZ(rot.x),
    } as alt.IVector3;
}

/**
 * SERVER ONLY
 * Return a position in front of a player based on distance.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} distance
 * @return {alt.Vector3}
 */
export function getVectorInFrontOfPlayer(
    entity: { rot: alt.IVector3; pos: alt.IVector3 },
    distance: number,
): alt.Vector3 {
    const forwardVector = getForwardVector(entity.rot);
    const posFront = {
        x: entity.pos.x + forwardVector.x * distance,
        y: entity.pos.y + forwardVector.y * distance,
        z: entity.pos.z,
    };

    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
}

/**
 * Determine if a vector is between vectors.
 * @param {alt.IVector3} pos A position in the world.
 * @param {alt.IVector3} vector1
 * @param {alt.IVector3} vector2
 * @returns {boolean}
 */
export function isBetweenVectors(pos: alt.IVector3, vector1: alt.IVector3, vector2: alt.IVector3): boolean {
    const validX = pos.x > vector1.x && pos.x < vector2.x;
    const validY = pos.y > vector1.y && pos.y < vector2.y;
    return validX && validY ? true : false;
}

/**
 * Get the closest server entity type. Server only.
 * @template T
 * @param {alt.IVector3} playerPosition
 * @param {alt.IVector3} rot player rotation
 * @param {Array<{ pos: alt.IVector3; valid?: boolean }>} entities
 * @param {number} distance
 * @return {(T | null)}
 */
export function getClosestEntity<T>(
    playerPosition: alt.IVector3,
    rot: alt.IVector3,
    entities: Array<{ pos: alt.IVector3; valid?: boolean }>,
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

/**
 *
 *
 * @param {number} x
 * @param {number} z
 * @return {number}
 */
function fwdX(x: number, z: number): number {
    const num = Math.abs(Math.cos(x));
    return -Math.sin(z) * num;
}

/**
 *
 *
 * @param {number} x
 * @param {number} z
 * @return {number}
 */
function fwdY(x: number, z: number): number {
    const num = Math.abs(Math.cos(x));
    return Math.cos(z) * num;
}

/**
 *
 *
 * @param {number} x
 * @return {number}
 */
function fwdZ(x: number): number {
    return Math.sin(x);
}

/**
 * Get the closest of a specific type of object with a `pos` property.
 *
 *
 * @template T
 * @param {alt.IVector3} pos A position in the world.
 * @param {Array<T & { pos: alt.IVector3 }} elements
 * @param {number} lastDistance
 */
export function getClosestOfType<T = { pos: alt.IVector3 }>(
    pos: alt.IVector3,
    elements: readonly (T & { pos: alt.IVector3 })[],
    lastDistance = 100,
): T | undefined {
    let lastClosest;

    for (let i = 0; i < elements.length; i++) {
        const dist = distance(pos, elements[i].pos);
        if (dist < lastDistance) {
            lastClosest = elements[i];
            lastDistance = dist;
        }
    }

    return lastClosest;
}

export default {
    distance,
    distance2d,
    fwdX,
    fwdY,
    fwdZ,
    getClosestEntity,
    getClosestOfType,
    getClosestTypes,
    getClosestVector,
    getClosestVectorByPos,
    getForwardVector,
    getVectorInFrontOfPlayer,
    isBetweenVectors,
    lerp,
    vectorLerp,
};
