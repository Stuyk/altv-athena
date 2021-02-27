import * as alt from 'alt-client';
import * as native from 'natives';

const zeroVector = { x: 0, y: 0, z: 0 };

/**
 * Draw a marker in an every tick.
 * @param  {number} type
 * @param  {alt.IVector3} pos
 * @param  {alt.IVector3} scale
 * @param  {alt.RGBA} color
 */
export function drawMarker(type: number, pos: alt.IVector3, scale: alt.IVector3, color: alt.RGBA) {
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
        false,
        true,
        2,
        false,
        undefined,
        undefined,
        false
    );
}
