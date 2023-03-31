import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Get cursor position that is similar to GTA:V screen sizes.
 *
 *
 * @return {alt.IVector2}  x: 0-1.0, y: 0-1.0
 */
export function getScaledCursorPosition(): alt.IVector2 {
    const cursor = alt.getCursorPos();
    const [_nothing, _x, _y] = native.getActualScreenResolution(0, 0);
    return {
        x: cursor.x / _x,
        y: cursor.y / _y,
    };
}
