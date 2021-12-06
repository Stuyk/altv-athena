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
     * An event to call when the player leaves the colshape.
     * @type {EventCall}
     * @memberof IStreamPolygon
     */
    leaveEventCall?: EventCall;
}
