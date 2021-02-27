import * as alt from 'alt-client';
import * as native from 'natives';

const temporaryText = [];
let tempInterval: number;

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

export function drawRectangle(pos: alt.IVector3, width: alt.IVector2, color: alt.RGBA) {
    const [isOnScreen, x, y] = native.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z, 0, 0);
    if (!isOnScreen) {
        return;
    }

    native.setDrawOrigin(pos.x, pos.y, pos.z, 0);
    native.drawRect(0, 0, width.x, width.y, color.r, color.g, color.b, color.a, false);
    native.clearDrawOrigin();
}

/**
 * Draw stable text in a 3D position with an every tick.
 * @param  {string} text
 * @param  {alt.Vector3} pos
 * @param  {number} scale
 * @param  {alt.RGBA} color
 */
export function drawText3D(text: string, pos: alt.IVector3, scale: number, color: alt.RGBA) {
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

/**
 * Adds text temporarily on the screen.
 * @export
 * @param {*} identifier
 * @param {*} msg
 * @param {*} x
 * @param {*} y
 * @param {*} scale
 * @param {*} r
 * @param {*} g
 * @param {*} b
 * @param {*} a
 * @param {*} ms
 */
export function addTemporaryText(
    identifier: string,
    msg: string,
    x: number,
    y: number,
    scale: number,
    r: number,
    g: number,
    b: number,
    a: number,
    ms: number
) {
    const index = temporaryText.findIndex((data) => data.identifier === identifier);

    if (index !== -1) {
        try {
            alt.clearTimeout(temporaryText[index].timeout);
        } catch (err) {}
        temporaryText.splice(index, 1);
    }

    const timeout = alt.setTimeout(() => {
        removeText(identifier);
    }, ms);

    temporaryText.push({ identifier, msg, x, y, scale, r, g, b, a, timeout });

    if (tempInterval) {
        alt.clearInterval(tempInterval);
        tempInterval = null;
    }

    tempInterval = alt.setInterval(handleDrawTemporaryText, 0);
}

/**
 * Stop drawing temporary text based on the name.
 * @param {*} identifier
 * @return {*}
 */
function removeText(identifier: string): void {
    const index = temporaryText.findIndex((data) => data.identifier === identifier);
    if (index <= -1) {
        return;
    }

    temporaryText.splice(index, 1);

    if (temporaryText.length <= 0) {
        alt.clearInterval(tempInterval);
        tempInterval = null;
    }
}

/**
 * Used in a setInterval,0 to draw text in the temporaryText array.
 */
function handleDrawTemporaryText(): void {
    for (let i = 0; i < temporaryText.length; i++) {
        const data = temporaryText[i];
        drawText2D(data.msg, { x: data.x, y: data.y }, data.scale, new alt.RGBA(data.r, data.g, data.b, data.a));
    }
}
