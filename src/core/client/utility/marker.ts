import * as alt from 'alt-client';
import * as native from 'natives';

const zeroVector = { x: 0, y: 0, z: 0 };

/**
 * Draw a marker in an every tick.
 * @param  {number} type
 * @param  {alt.IVector3} pos
 * @param  {alt.IVector3} scale
 * @param  {alt.RGBA} color
 * @param  {boolean} bobUpAndDown
 * @param  {boolean} faceCamera
 * @param {boolean} rotate
 */
export function drawMarker(
    type: number,
    pos: alt.IVector3,
    scale: alt.IVector3,
    color: alt.RGBA,
    bobUpAndDown: boolean = false,
    faceCamera: boolean = true,
    rotate: boolean = false,
    rot: alt.IVector3,
) {
    native.drawMarker(
        type,
        pos.x,
        pos.y,
        pos.z,
        zeroVector.x,
        zeroVector.y,
        zeroVector.z,
        radToDeg(rot.x),
        radToDeg(rot.y),
        radToDeg(rot.z),
        scale.x,
        scale.y,
        scale.z,
        color.r,
        color.g,
        color.b,
        color.a,
        bobUpAndDown,
        faceCamera,
        2,
        rotate,
        undefined,
        undefined,
        false,
    );
}

function radToDeg(rad: number) {
    return (rad * 180) / Math.PI;
}
