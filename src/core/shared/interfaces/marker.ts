import * as alt from 'alt-shared';
import { MARKER_TYPE } from '../enums/markerTypes.js';

/**
 * Used to pass marker information from server to client.
 *
 *
 * @interface Marker
 */
export interface Marker {
    /**
     * Position of the Object in a 3D space.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The Marker Type Associated with this Marker
     * @type {number}
     *
     */
    type: MARKER_TYPE | number;

    /**
     * The color of the marker. All values are 0 - 255.
     * @type { alt.RGBA }
     *
     */
    color: alt.RGBA;

    /**
     * The scale of this marker.
     * @type {alt.IVector3}
     *
     */
    scale?: alt.IVector3;

    /**
     * The max distance to render this marker.
     * @type {number}
     *
     */
    maxDistance?: number;

    /**
     * The unique identifier for this marker.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The dimension to display this marker in.
     * @type {number}
     *
     */
    dimension?: number;

    /**
     * Should the marker be slightly animated.
     * @type {boolean}
     *
     */
    bobUpAndDown?: boolean;

    /**
     * Should the marker face the player's camera.
     * @type {boolean}
     *
     */
    faceCamera?: boolean;

    /**
     * Should the marker rotate to face the player.
     * @type {boolean}
     *
     */
    rotate?: boolean;
}
