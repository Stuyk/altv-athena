import * as alt from 'alt-client';
import * as native from 'natives';

const DefaultData = {
    minStart: 5,
    iterations: 10,
    increment: 1,
};

export function getGroundPosition(pos: alt.IVector3, options: typeof DefaultData = DefaultData): alt.IVector3 {
    const zPos = pos.z;

    let zToUse = zPos - options.minStart;
    for (let i = 0; i < options.iterations; i++) {
        const [found, zPos] = native.getGroundZFor3dCoord(pos.x, pos.y, zToUse, zToUse, false, true);
        if (found) {
            return new alt.Vector3(pos.x, pos.y, zPos);
        }

        zToUse += options.increment;
    }

    return pos;
}
