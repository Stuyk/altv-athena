import * as alt from 'alt-shared';
import { DroppedItem } from './item';

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
     * @type {alt.IVector3}
     * @memberof GroundItem
     */
    pos: alt.IVector3;

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
