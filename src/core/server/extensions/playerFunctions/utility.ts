import * as alt from 'alt-server';
import { distance, distance2d, getClosestTypes } from '../../../shared/utility/vector';
import { getClosestEntity, getForwardVector } from '../../utility/vector';

/**
 * Get a position in front of this player based on direction they are facing.
 * @param {number} distance Amount of distance we want to go out from the player.
 * @return {*}  {alt.Vector3}
 * @memberof UtilityPrototype
 */
function getPositionFrontOf(p: alt.Player, distance: number) {
    const fwdVector = getForwardVector(p.rot);
    return new alt.Vector3(p.pos.x + fwdVector.x * distance, p.pos.y + fwdVector.y * distance, p.pos.z);
}

/**
 * Gets distance to object. Ignores Z axis.
 * @param {alt.Vector3} position
 * @return {*}  {number}
 * @memberof UtilityPrototype
 */
function getDistanceTo2D(p: alt.Player, position: alt.Vector3): number {
    return distance2d(p.pos, position);
}

/**
 * Gets distance to object. Uses Z Axis.
 * @param {alt.Vector3} position
 * @return {*}  {number}
 * @memberof UtilityPrototype
 */
function getDistanceTo3D(p: alt.Player, position: alt.Vector3): number {
    return distance(p.pos, position);
}

/**
 * Get the vehicle in front of the player.
 * @param {number} distance
 * @return {*}  {(alt.Vehicle | null)}
 * @memberof UtilityPrototype
 */
function getVehicleInFrontOf(p: alt.Player, distance: number): alt.Vehicle | null {
    return getClosestEntity<alt.Vehicle>(p.pos, p.rot, [...alt.Vehicle.all], distance);
}

/**
 * Get the player in front of the player.
 * @param {number} distance
 * @return {*}  {(alt.Player | null)}
 * @memberof UtilityPrototype
 */
function getPlayerInFrontOf(p: alt.Player, distance: number): alt.Player | null {
    return getClosestEntity<alt.Player>(p.pos, p.rot, [...alt.Player.all], distance);
}

/**
 * Gets the closest players in reference to the passed player.
 * @param {alt.Player} p
 * @param {number} distance
 * @return {*}  {Array<alt.Player>}
 */
function getClosestPlayers(p: alt.Player, distance: number): Array<alt.Player> {
    return getClosestTypes<alt.Player>(p.pos, alt.Player.all, distance, ['data', 'discord', 'accountData']);
}

export default {
    getClosestPlayers,
    getDistanceTo2D,
    getDistanceTo3D,
    getPlayerInFrontOf,
    getPositionFrontOf,
    getVehicleInFrontOf
};
