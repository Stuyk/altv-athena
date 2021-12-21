import { Item } from './item';

/**
 * Storage works for Vehicles, Interiors, etc.
 * @export
 * @interface IStorage
 */
export interface IStorage {
    /**
     * The database entry id for this storage box.
     * @type {unknown}
     * @memberof Interior
     */
    _id?: unknown;

    /**
     * The amount of cash that is in this storage box.
     * @type {number}
     * @memberof IStorage
     */
    cash: number;

    /**
     * Items that are inside of this storage box.
     * @type {Array<Item>}
     * @memberof IStorage
     */
    items: Array<Item>;

    /**
     * The maximum amount of items that can exist in this storage box.
     * @type {number}
     * @memberof IStorage
     */
    maxSize: number;

    /**
     * The time this storage container was last accessed and updated.
     * @type {number}
     * @memberof IStorage
     */
    lastUpdate?: number;
}
