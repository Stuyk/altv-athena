import * as alt from 'alt-client';
import * as native from 'natives';

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
