import * as alt from 'alt-shared';

/**
 * Used to pass object information from server to client.
 *
 * @export
 * @interface IObject
 */
export interface IObject {
    /**
     * A unique identifier for this object.
     * @type {string}
     * @memberof IObject
     */
    uid?: string;

    /**
     * Use this parameter to help you identify what this item does on client-side.
     *
     * Useful for wheel menu based functionality.
     *
     * @type {string}
     * @memberof IObject
     */
    subType?: string;

    /**
     * Position of the Object in a 3D space.
     * @type {alt.IVector3}
     * @memberof IObject
     */
    pos: alt.IVector3;

    /**
     * The model name this object.
     * @type {string}
     * @memberof IObject
     */
    model: string;

    /**
     * The rotation of this object.
     * @type {alt.IVector3}
     * @memberof IObject
     */
    rot?: alt.IVector3;

    /**
     * The max distance this object should render at.
     * @type {number}
     * @memberof IObject
     */
    maxDistance?: number;

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
