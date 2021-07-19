import * as alt from 'alt-client';
import * as native from 'natives';
import { Vector2 } from '../../shared/interfaces/Vector';

export function getCrossProduct(v1: alt.Vector3, v2: alt.Vector3): alt.Vector3 {
    return new alt.Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
}

export function getNormalizedVector(vector: alt.Vector3): alt.Vector3 {
    const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    return new alt.Vector3(vector.x / mag, vector.y / mag, vector.z / mag);
}

export function degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function rotationToDirection(rotation: alt.IVector3): alt.Vector3 {
    const z = degToRad(rotation.z);
    const x = degToRad(rotation.x);
    const num = Math.abs(Math.cos(x));

    return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

export function getPointsInCircle(points: number, radius: number, center: Vector2): Array<Vector2> {
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

export function getAverage(data: Array<number>): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }

    return sum / data.length;
}
