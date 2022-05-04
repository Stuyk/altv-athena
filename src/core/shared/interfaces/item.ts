import { EQUIPMENT_TYPE } from '../enums/equipmentType';
import { ITEM_TYPE } from '../enums/itemTypes';

export interface ItemData {
    [key: string]: any;
}

export interface Item<T = ItemData> {
    /**
     * Database entry for item. Do not add / append.
     * @type {unknown}
     * @memberof Item
     */
    _id?: unknown;

    /**
     * The name of this item.
     * @type {string}
     * @memberof Item
     */
    name: string;

    /**
     * Only apply this if the item is going in the item registry database.
     * You will use this fetch an exact item from the database.
     * @type {string}
     * @memberof Item
     */
    dbName?: string;

    /**
     * A unique identifier for this item.
     * @type {string}
     * @memberof Item
     */
    uuid?: string;

    /**
     * A description for this item.
     * @type {string}
     * @memberof Item
     */
    description: string;

    /**
     * Auto-color rarity.
     * 0 - Grey
     * 1 - White
     * 2 - Green
     * 3 - Blue
     * 4 - Purple
     * 5 - Orange
     * 6 - Red
     * @type {number}
     * @memberof Item
     */
    rarity?: number;

    /**
     * A client-side icon name.
     * They are specified and created by you.
     * @type {string}
     * @memberof Item
     */
    icon: string;

    /**
     * The quantity of this type of item.
     * Used for stacks.
     * @type {number}
     * @memberof Item
     */
    quantity: number;

    /**
     * If this value is defined it will be used as the maximum stack size for the item.
     * @type {number}
     * @memberof Item
     */
    maxStack?: number;

    /**
     * A bitwise enum representing functionality of the item.
     * ie. 'ITEM_TYPE.CAN_EQUIP | ITEM_TYPE.IS_TOOLBAR'
     *
     * Multiple of these can be used to create unique items.
     * @type {ITEM_TYPE}
     * @memberof Item
     */
    behavior: ITEM_TYPE;

    /**
     * Where this item should sit in the player's inventory.
     * Basically the position of the item on-screen.
     * @type {number}
     * @memberof Item
     */
    slot?: number;

    /**
     * A unique hash for this item.
     * @type {string}
     * @memberof Item
     */
    hash?: string;

    /**
     * Only supply this when it is a clothing component.
     * Should only supply one and not combine.
     * @type {EQUIPMENT_TYPE}
     * @memberof Item
     */
    equipment?: EQUIPMENT_TYPE;

    /**
     * The model representation of the item.
     * Should be a GTA:V item like: 'prop_cs_box_clothes'
     * @type {string}
     * @memberof Item
     */
    model?: string;

    /**
     * Any custom data associated with this item.
     * Useful for item effects and such.
     * @type { ItemData | T }
     * @memberof Item
     */
    data: ItemData | T;

    /**
     * In case you want to track item versions and modify older versions of items per-inventory.
     * @type {number}
     * @memberof Item
     */
    version?: number;
}

export interface ItemSpecial extends Item {
    dataName: string;
    dataIndex: number;
    isInventory: boolean;
    isEquipment: boolean;
    isToolbar: boolean;
}

export interface DroppedItem {
    item: Item;
    position: { x: number; y: number; z: number };
    gridSpace: number;
    dimension: number;
}
