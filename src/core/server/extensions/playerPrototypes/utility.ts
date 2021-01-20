import * as alt from 'alt-server';
import { distance, distance2d } from '../../../shared/utility/vector';
import { getClosestEntity, getForwardVector } from '../../utility/vector';

export interface UtilityPrototype {
    /**
     * Gets distance to object. Ignores Z axis.
     * @param {alt.Vector3} position
     * @return {*}  {number}
     * @memberof UtilityPrototype
     */
    getDistanceTo2D(position: alt.Vector3): number;

    /**
     * Gets distance to object. Uses Z Axis.
     * @param {alt.Vector3} position
     * @return {*}  {number}
     * @memberof UtilityPrototype
     */
    getDistanceTo3D(position: alt.Vector3): number;

    /**
     * Get the player in front of the player.
     * @param {number} distance
     * @return {*}  {(alt.Player | null)}
     * @memberof UtilityPrototype
     */
    getPlayerInFrontOf(distance: number): alt.Player | null;

    /**
     * Get a position in front of this player based on direction they are facing.
     * @param {number} distance Amount of distance we want to go out from the player.
     * @return {*}  {alt.Vector3}
     * @memberof UtilityPrototype
     */
    getPositionFrontOf(distance: number): alt.Vector3;

    /**
     * Get the vehicle in front of the player.
     * @param {number} distance
     * @return {*}  {(alt.Vehicle | null)}
     * @memberof UtilityPrototype
     */
    getVehicleInFrontOf(distance: number): alt.Vehicle | null;
}

export function bind(): UtilityPrototype {
    const _this = this;
    _this.getDistanceTo2D = getDistanceTo2D;
    _this.getDistanceTo3D = getDistanceTo3D;
    _this.getPlayerInFrontOf = getPlayerInFrontOf;
    _this.getPositionFrontOf = getPositionFrontOf;
    _this.getVehicleInFrontOf = getVehicleInFrontOf;
    return _this;
}

function getPositionFrontOf(distance: number) {
    const p: alt.Player = (this as unknown) as alt.Player;
    const fwdVector = getForwardVector(p.rot);
    return new alt.Vector3(p.pos.x + fwdVector.x * distance, p.pos.y + fwdVector.y * distance, p.pos.z);
}

function getDistanceTo2D(position: alt.Vector3): number {
    const p: alt.Player = (this as unknown) as alt.Player;
    return distance2d(p.pos, position);
}

function getDistanceTo3D(position: alt.Vector3): number {
    const p: alt.Player = (this as unknown) as alt.Player;
    return distance(p.pos, position);
}

function getVehicleInFrontOf(distance: number): alt.Vehicle | null {
    const p: alt.Player = (this as unknown) as alt.Player;
    return getClosestEntity<alt.Vehicle>(p.pos, p.rot, [...alt.Vehicle.all], distance);
}

function getPlayerInFrontOf(distance: number): alt.Player | null {
    const p: alt.Player = (this as unknown) as alt.Player;
    return getClosestEntity<alt.Player>(p.pos, p.rot, [...alt.Player.all], distance);
}
