import * as alt from 'alt-client';

/**
 * It's a function that takes two vectors and returns a vector.
 *
 *
 * @name getCrossProduct

 * @param {alt.Vector3} v1
 * @param {alt.Vector3} v2
 * @returns {alt.Vector3}
 * s
 */
export function getCrossProduct(v1: alt.Vector3, v2: alt.Vector3): alt.Vector3 {
    return new alt.Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
}

/**
 * It's a function that takes a vector and returns a normalized vector.
 *
 *
 * @name getNormalizedVector

 * @param {alt.Vector3} vector
 * @returns {alt.Vector3}
 * s
 */
export function getNormalizedVector(vector: alt.Vector3): alt.Vector3 {
    const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    return new alt.Vector3(vector.x / mag, vector.y / mag, vector.z / mag);
}

/**
 * Converts degrees to radians
 *
 *
 * @name degToRad

 * @param {number} degrees
 * @returns {number}
 * s
 */
export function degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Could also be seen as rotAnglesToVector
 *
 *
 * @param {alt.IVector3} rotation
 * @return {alt.Vector3}
 */
export function rotationToDirection(rotation: alt.IVector3): alt.Vector3 {
    const z = degToRad(rotation.z);
    const x = degToRad(rotation.x);
    const num = Math.abs(Math.cos(x));

    return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

/**
 * It's converting a rotation to a direction.
 *
 *
 * @name getDirectionFromRotation

 * @param {alt.IVector3} rotation
 * @returns {alt.IVector3}
 * s
 */
export function getDirectionFromRotation(rotation: alt.IVector3): alt.IVector3 {
    const z = rotation.z * (Math.PI / 180.0);
    const x = rotation.x * (Math.PI / 180.0);
    const num = Math.abs(Math.cos(x));

    return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

/**
 * Returns an array of alt.IVector2 in a circle
 *
 *
 * @name getPointsInCircle

 * @param {number} points
 * @param {number} radius
 * @param {alt.IVector2} center
 * @returns {Array<alt.IVector2>}
 * s
 */
export function getPointsInCircle(points: number, radius: number, center: alt.IVector2): Array<alt.IVector2> {
    const slice = (2 * Math.PI) / points;
    const pointDefs = [];

    for (let i = 0; i < points; i++) {
        const sliceAngle = slice * i;
        const x = center.x + (radius / 2) * Math.cos(sliceAngle);
        const y = center.y + radius * Math.sin(sliceAngle);
        pointDefs.push({ x, y });
    }

    return pointDefs;
}

/**
 * Returns the average value among all numbers.
 *
 *
 * @param {Array<number>} data
 * @return {number}
 */
export function getAverage(data: Array<number>): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }

    return sum / data.length;
}
