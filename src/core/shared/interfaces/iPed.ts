import * as alt from 'alt-shared';
import { Animation } from './animation.js';

/**
 * Used to pass static ped information from server to client.
 *
 *
 * @interface IPed
 */
export interface IPed {
    /**
     * Position of the Ped in a 3D space.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The model name this Ped.
     * @type {string}
     *
     */
    model: string;

    /**
     * The rotation of this Ped. 0 - 360
     * @type {number}
     *
     */
    rotation?: alt.Vector3;

    /**
     * Freeze this ped
     *
     * @type {boolean}
     * @memberof IPed
     */
    frozen?: boolean;

    /**
     * Remove collision for this ped?
     *
     * @type {boolean}
     * @memberof IPed
     */
    collision?: boolean;

    /**
     * The max distance this Ped should render at.
     * @type {number}
     *
     */
    maxDistance?: number;

    /**
     * A unique identifier for this Ped.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * A list of random animations to play on this pedestrian.
     * @type {Animation[]}
     *
     */
    animations?: Animation[];

    /**
     * Should the appearance of this ped be randomized when spawned?
     * @type {boolean}
     *
     */
    randomizeAppearance?: boolean;

    /**
     * Local Ped ID.
     * Do not actually fill this out.
     * @type {number}
     *
     */
    local?: number;

    /**
     * Local Ped Info
     * Do not automatically fill this out.
     * @type {boolean}
     *
     */
    isBeingCreated?: boolean;

    /**
     * Will show across all dimensions.
     * @type {number}
     *
     */
    dimension?: number;
}
