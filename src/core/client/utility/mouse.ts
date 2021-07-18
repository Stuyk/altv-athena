import * as alt from 'alt-client';
import * as native from 'natives';
import { Vector2 } from '../../shared/interfaces/Vector';

export function getScaledCursorPosition(): Vector2 {
    const cursor = alt.getCursorPos();
    const [_nothing, _x, _y] = native.getActiveScreenResolution(0, 0);
    return {
        x: cursor.x / _x,
        y: cursor.y / _y
    };
}
