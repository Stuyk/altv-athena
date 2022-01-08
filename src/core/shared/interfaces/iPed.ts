import { Vector3 } from './vector';
import { Animation } from './animation';

export interface IPed {
    /**
     * Position of the Ped in a 3D space.
     * @type {Vector3}
     * @memberof IPed
     */
    pos: Vector3;

    /**
     * The model name this Ped.
     * @type {string}
     * @memberof IPed
     */
    model: string;

    /**
     * The rotation of this Ped. 0 - 360
     * @type {number}
     * @memberof IPed
     */
    heading?: number;

    /**
     * The max distance this Ped should render at.
     * @type {number}
     * @memberof IPed
     */
    maxDistance?: number;

    /**
     * A unique identifier for this Ped.
     * @type {string}
     * @memberof IPed
     */
    uid: string;

    /**
     * A list of random animations to play on this pedestrian.
     * @type {Animation[]}
     * @memberof IPed
     */
    animations?: Animation[];

    /**
     * Should the appearance of this ped be randomized when spawned?
     * @type {boolean}
     * @memberof IPed
     */
    randomizeAppearance?: boolean;

    /**
     * Local Ped ID.
     * Do not actually fill this out.
     * @type {number}
     * @memberof IPed
     */
    local?: number;

    /**
     * Local Ped Info
     * Do not automatically fill this out.
     * @type {boolean}
     * @memberof IPed
     */
    isBeingCreated?: boolean;

    /**
     * Will show across all dimensions.
     * @type {number}
     * @memberof IPed
     */
    dimension?: number;
}
