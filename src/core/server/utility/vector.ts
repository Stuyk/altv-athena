import * as alt from 'alt-server';

/**
 * SERVER ONLY
 * Gets the direction the player is facing.
 * @param {alt.Vector3} rot
 */
export function getForwardVector(rot: alt.Vector3): alt.Vector3 {
    const z = rot.z;
    const x = rot.x;
    const num = Math.abs(Math.cos(x));
    return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

/**
 * SERVER ONLY
 * Return a position in front of a player based on distance.
 * @export
 * @param {alt.Player} player
 * @param {number} distance
 * @return {*}  {alt.Vector3}
 */
export function getVectorInFrontOfPlayer(player: alt.Player, distance: number): alt.Vector3 {
    const forwardVector = getForwardVector(player.rot);
    const posFront = {
        x: player.pos.x + forwardVector.x * distance,
        y: player.pos.y + forwardVector.y * distance,
        z: player.pos.z
    };

    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
}

/**
 * Determine if a vector is between vectors.
 * @param {alt.Vector3} pos
 * @param {alt.Vector3} vector1
 * @param {alt.Vector3} vector2
 * @returns {boolean}
 */
export function isBetweenVectors(pos, vector1, vector2): boolean {
    const validX = pos.x > vector1.x && pos.x < vector2.x;
    const validY = pos.y > vector1.y && pos.y < vector2.y;
    return validX && validY ? true : false;
}
