import { Vector3 } from './vector';

/**
 * A slightly transparent hologram of a model.
 * Mostly used by the dealership.
 * @export
 * @interface Hologram
 */
export interface Hologram {
    /**
     * A unique identifier for the Hologram.
     * @type {string}
     * @memberof Hologram
     */
    identifier: string;

    /**
     * A vehicle model, object model, etc.
     * @type {string}
     * @memberof Hologram
     */
    model: string;

    /**
     * The 3D position in the world for this hologram.
     * @type {Vector3}
     * @memberof Hologram
     */
    position: Vector3;

    /**
     * The direction of this hologram. 0 - 360.
     * @type {number}
     * @memberof Hologram
     */
    heading: number;

    /**
     * Show this hologram from anywhere?
     * @type {boolean}
     * @memberof Hologram
     */
    noMaxDistance?: boolean;

    /**
     * Set this hologram to be hidden.
     * Used client-side don't set this.
     * @type {boolean}
     * @memberof Hologram
     */
    isHidden?: boolean;

    /**
     * Used client-side don't set this.
     * @type {number}
     * @memberof Hologram
     */
    clientRef?: number;
}
