import { DroppedItem } from './Item';
import { Vector3 } from './Vector';

/**
 * A type of interface for streaming ground items.
 * @export
 * @interface GroundItem
 */
export interface GroundItem {
    /**
     * The position where to place the GroundItem in a 3D space.
     * @type {Vector3}
     * @memberof GroundItem
     */
    pos: Vector3;

    /**
     * The DroppedItem Representation of this Item
     * @type {string}
     * @memberof GroundItem
     */
    item: DroppedItem;

    /**
     * The maximum distance this item should render at.
     * @type {number}
     * @memberof GroundItem
     */
    maxDistance?: number;

    /**
     * The unique identifier to remove this ground item if necessary.
     * @type {string}
     * @memberof GroundItem
     */
    uid?: string;

    /**
     * The dimension to show this ground item in.
     * @type {number}
     * @memberof GroundItem
     */
    dimension?: number;
}
