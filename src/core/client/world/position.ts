import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

const DefaultData = {
    minStart: 5,
    iterations: 10,
    increment: 1,
};

/**
 * Returns a Vector3 with a modified z position if the ground position is found.
 *
 * Otherwise, returns the original Vector3.
 *
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {typeof DefaultData} [options=DefaultData]
 * @return {alt.IVector3}
 */
export function getGroundZ(pos: alt.IVector3, options: typeof DefaultData = DefaultData): alt.IVector3 {
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

/**
 * Check if an entity is in front of the position the camera is looking at.
 * Should be used periodically and not in an every tick. Could be expensive.
 *
 * @return {boolean}
 */
export function isEntityBlockingPosition(pos: alt.IVector3, range = 0.8, maxDistance = 100): boolean {
    const closestPlayers = alt.Player.all.filter((target) => {
        const dist = AthenaClient.utility.vector.distance2d(target.pos, pos);
        if (dist > maxDistance) {
            return false;
        }

        return true;
    });

    const closestVehicles = alt.Vehicle.all.filter((target) => {
        const dist = AthenaClient.utility.vector.distance2d(target.pos, pos);
        if (dist > maxDistance) {
            return false;
        }

        return true;
    });

    const altPos = new alt.Vector3(pos);
    const A = alt.getCamPos();
    const AB = altPos.sub(A).normalize();
    for (let i = 0; i < 100; i++) {
        const ABMult = AB.mul(range * i);
        const finalPos = A.add(ABMult);

        // If the final position is close enough to the position, return;
        const dist = AthenaClient.utility.vector.distance(finalPos, pos);
        if (dist <= 1) {
            return false;
        }

        const isPlayerBlocking = closestPlayers.find((target) => {
            return AthenaClient.utility.vector.distance(target.pos, finalPos) <= range;
        });

        const isVehicleBlocking = closestVehicles.find((target) => {
            return AthenaClient.utility.vector.distance(target.pos, finalPos) <= range;
        });

        if (!isPlayerBlocking && !isVehicleBlocking) {
            continue;
        }

        return true;
    }

    return false;
}
