import { Vector3 } from './vector';

export interface IObject {
    /**
     * Position of the Object in a 3D space.
     * @type {Vector3}
     * @memberof IObject
     */
    pos: Vector3;

    /**
     * The model name this object.
     * @type {string}
     * @memberof IObject
     */
    model: string;

    /**
     * The rotation of this object.
     * @type {Vector3}
     * @memberof IObject
     */
    rot?: Vector3;

    /**
     * The max distance this object should render at.
     * @type {number}
     * @memberof IObject
     */
    maxDistance?: number;

    /**
     * A unique identifier for this object.
     * @type {string}
     * @memberof IObject
     */
    uid: string;

    /**
     * Local Object ID.
     * Do not actually fill this out.
     * @type {number}
     * @memberof IObject
     */
    local?: number;

    /**
     * Local Object Info
     * Do not automatically fill this out.
     * @type {boolean}
     * @memberof IObject
     */
    isBeingCreated?: boolean;

    /**
     * Is this object interior only.
     * Will only show in a matching interior dimension.
     * @type {boolean}
     * @memberof IObject
     */
    isInterior?: boolean;

    /**
     * Will show across all dimensions.
     * @type {number}
     * @memberof IObject
     */
    dimension?: number;

    /**
     * Should this object have no collision?
     * @type {boolean}
     * @memberof IObject
     */
    noCollision?: boolean;
}
