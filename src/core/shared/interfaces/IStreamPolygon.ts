import { EventCall } from './EventCall';
import { Vector3 } from './Vector';

export interface IStreamPolygon {
    /**
     * A unique identifier for this polygon.
     * @type {string}
     * @memberof IStreamPolygon
     */
    uid?: string;

    /**
     * Center Position of the Polygon
     * @type {Vector3}
     * @memberof IObject
     */
    pos: Vector3;

    /**
     * Vertices for a polygon. The corners.
     * @type {Array<Vector3>}
     * @memberof IStreamPolygon
     */
    vertices: Array<Vector3>;

    /**
     * Show the polygon client-side?
     * @type {boolean}
     * @memberof IStreamPolygon
     */
    debug?: boolean;

    /**
     * Used for individual draw distance for a player.
     * @type {number}
     * @memberof IStreamPolygon
     */
    distance?: number;

    /**
     * An event to call when the player enters the colshape.
     * @type {EventCall}
     * @memberof IStreamPolygon
     */
    enterEventCall?: EventCall;

    /**
     * Maximum Y Position for Polygon
     * Used to prevent triggering above a certain height.
     * Uses the Z of the center point as the basis.
     * Player height is roughly 2 so a building's internal height is roughly 6 or 7.
     * @type {number}
     * @memberof IStreamPolygon
     */
    maxY?: number;

    /**
     * An event to call when the player leaves the colshape.
     * @type {EventCall}
     * @memberof IStreamPolygon
     */
    leaveEventCall?: EventCall;
}
