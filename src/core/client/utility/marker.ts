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
) {
    native.drawMarker(
        type,
        pos.x,
        pos.y,
        pos.z,
        zeroVector.x,
        zeroVector.y,
        zeroVector.z,
        zeroVector.x,
        zeroVector.y,
        zeroVector.z,
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
