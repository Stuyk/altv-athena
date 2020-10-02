import { Vector2, Vector3 } from '../interfaces/Vector';

export function distance(vector1: Vector3, vector2: Vector3) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}

export function distance2d(vector1: Vector2, vector2: Vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}

export function getClosestVector(pos: Vector3, arrayOfPositions: Vector3[]) {
    arrayOfPositions.sort((a, b) => {
        return distance(pos, a) - distance(pos, b);
    });

    return arrayOfPositions[0];
}

export function getClosestVectorByPos<T>(pos: Vector3, arrayOfPositions: T[], posVariable: string = 'pos'): T {
    arrayOfPositions.sort((a, b) => {
        return distance(pos, a[posVariable]) - distance(pos, b[posVariable]);
    });

    return arrayOfPositions[0];
}
