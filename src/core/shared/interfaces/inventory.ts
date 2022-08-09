import { ITEM_TYPE } from '../enums/itemTypes';

/** Do Not Export */
interface SharedItemData {
    /**
     * The display of the item.
     * Used for displaying in an inventory ui.
     *
     * @type {string}
     * @memberof BaseItem
     */
    name: string;

    /**
     * Used to fetch this specific item.
     *
     * Kebab case item reference.
     * Example: 'golden-pickaxe'
     *
     * @type {string}
     * @memberof BaseItem
     */
    base: string;

    /**
     * The path where the icon is stored.
     *
     * @type {string}
     * @memberof SharedItemData
     */
    icon: string;

    /**
     * If it is a base item, how much 1 item weighs.
     * If it is a single item how much the stack weighs.
     *
     * @type {number}
     * @memberof Item
     */
    weight: number;

    /**
     * What flags should apply to this item specifically.
     *
     * @type {ITEM_TYPE}
     * @memberof BaseItem
     */
    flags: ITEM_TYPE;
}

/**
 * Items that are stored in the item database.
 *
 * @export
 * @interface BaseItem
 * @extends {SharedItemData}
 * @template T
 */
export interface BaseItem<T = Object> extends SharedItemData {
    /**
     * Database identifier.
     *
     * @type {*}
     * @memberof BaseItem
     */
    _id?: any;

    /**
     * The current revision of this specific Item.
     *
     * @type {number}
     * @memberof BaseItem
     */
    version: number;

    /**
     * This is the maximum amount of items that can be stacked for this base item type.
     *
     * @type {number}
     * @memberof BaseItem
     */
    stack: number;

    /**
     * Data to apply to the Item when it is created.
     * Think of it like a base data template to append to all items created in the future.
     *
     * @type {T}
     * @memberof BaseItem
     */
    dataToAppend: T;
}

/**
 * Items that are stored in
 * - player.data.inventory
 * - player.data.equipment
 * - player.data.toolbar
 *
 * @export
 * @interface StoredItem
 * @template T
 */
export interface StoredItem<T = Object> {
    /**
     * The database item to reference to build this item.
     *
     * @type {string}
     * @memberof Item
     */
    base: string;

    /**
     * The number of items in this item's stack
     *
     * @type {number}
     * @memberof Item
     */
    quantity: number;

    /**
     * The slot where this item currently resides.
     *
     * @type {number}
     * @memberof Item
     */
    slot: number;

    /**
     * The current revision of this specific Item.
     *
     * @type {number}
     * @memberof Item
     */
    version: number;

    /**
     *  Any unique data to store on this item.
     *
     * @type {T}
     * @memberof Item
     */
    data: T;
}

/**
 * Items that are fully constructed in server-cache.
 */
export type Item<T = Object> = SharedItemData & StoredItem<T>;
export type ItemSlot = 'inventory' | 'equipment' | 'toolbar';
export type CharacterInventory<T = Object> = {
    data: {
        [key: string]: any;
        _id: any;
        equipment: Array<Item<T>>;
        inventory: Array<Item<T>>;
        toolbar: Array<Item<T>>;
    };
};
