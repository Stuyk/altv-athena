import { DroppedItem } from './item';
import { Vector3 } from './vector';

/**
 * A type of interface for streaming ground items.
 * @export
 * @interface GroundItem
 */
export interface GroundItem {
    /**
     * The DroppedItem Representation of this Item
     * @type {string}
     * @memberof GroundItem
     */
    item: DroppedItem;

    /**
     * The position of the item.
     * @type {Vector3}
     * @memberof GroundItem
     */
    pos: Vector3;

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
}
