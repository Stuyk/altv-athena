import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Draw text on your screen in a 2D position wtih an every tick.
 * @param  {string} text
 * @param  {alt.Vector2} pos
 * @param  {number} scale
 * @param  {alt.RGBA} color
 */
export function drawText2D(text: string, pos: alt.IVector2, scale: number, color: alt.RGBA) {
    if (scale > 2) {
        scale = 2;
    }

    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(4);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(color.r, color.g, color.b, color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.endTextCommandDisplayText(pos.x, pos.y, 0);
}

/**
 * Draw stable text in a 3D position with an every tick.
 * @param  {string} text
 * @param  {alt.Vector3} pos
 * @param  {number} scale
 * @param  {alt.RGBA} color
 */
export function drawText3D(text: string, pos: alt.Vector3, scale: number, color: alt.RGBA) {
    if (scale > 2) {
        scale = 2;
    }

    native.setDrawOrigin(pos.x, pos.y, pos.z, 0); // Used to stabalize text, sprites, etc. in a 3D Space.
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(4);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(color.r, color.g, color.b, color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}
