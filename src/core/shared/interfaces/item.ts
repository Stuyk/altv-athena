import { EQUIPMENT_TYPE } from '@AthenaShared/enums/equipmentType';

/**
 * Item behavior associated with an item
 *
 * @export
 * @interface DefaultItemBehavior
 */
export interface DefaultItemBehavior {
    /**
     * Can this item be dropped.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    canDrop?: boolean;

    /**
     * Can the item be stacked
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    canStack?: boolean;

    /**
     * Can the item be traded
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    canTrade?: boolean;

    /**
     * Is this item an equipment item.
     * Such as clothing.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isEquipment?: boolean;

    /**
     * Can this item be added to the toolbar.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isToolbar?: boolean;

    /**
     * Is this item a weapon?
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isWeapon?: boolean;

    /**
     * Destroy this item on drop.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    destroyOnDrop?: boolean;
}

/**
 * Shared Item Information for Both Interfaces Below
 *
 * @interface SharedItem
 * @template CustomData
 */
interface SharedItem<CustomData = {}> {
    /**
     * The matching database name for this item.
     *
     * @type {string}
     * @memberof SharedItem
     */
    dbName: string;

    /**
     * Any custom data assigned to this item.
     *
     * @type {CustomData}
     * @memberof SharedItem
     */
    data: CustomData;

    /**
     * The version of this item it is based upon.
     *
     * @type {number}
     * @memberof SharedItem
     */
    version?: number;
}

/**
 * The StoredItem is stored in the player in the following locations:
 * equipment, inventory, and toolbar
 *
 * @export
 * @interface StoredItem
 * @extends {SharedItem<CustomData>}
 * @template CustomData
 */
export interface StoredItem<CustomData = {}> extends SharedItem<CustomData> {
    /**
     * The amount of this item the player has.
     *
     * @type {number}
     * @memberof StoredItem
     */
    quantity: number;

    /**
     * Where this item should be displayed in a toolbar, equipment bar, or inventory bar.
     *
     * @type {number}
     * @memberof StoredItem
     */
    slot: number;

    /**
     * The weight calculated for this item.
     *
     * @type {number}
     * @memberof StoredItem
     */
    totalWeight?: number;
}

/**
 * The BaseItem is used as a way for the main items to point towards item information.
 * This item stored in the database is used to construct front facing item information.
 *
 * @export
 * @interface BaseItem
 * @extends {SharedItem<CustomData>}
 * @template Behavior
 * @template CustomData
 */
export interface BaseItem<Behavior = DefaultItemBehavior, CustomData = {}> extends SharedItem<CustomData> {
    /**
     * Database entry for item. Do not add / append.
     *
     * @type {unknown}
     * @memberof BaseItem
     */
    _id?: unknown;

    /**
     * The name of this item.
     *
     * @type {string}
     * @memberof BaseItem
     */
    name: string;

    /**
     * A client-side icon name.
     * They are specified and created by you.
     *
     * @type {string}
     * @memberof BaseItem
     */
    icon: string;

    /**
     * If this value is defined it will be used as the maximum stack size for the item.
     *
     * @type {number}
     * @memberof BaseItem
     */
    maxStack?: number;

    /**
     * The weight of this item.
     *
     * @type {number}
     * @memberof BaseItem
     */
    weight?: number;

    /**
     * Behavior associated with this item.
     *
     * @type {Behavior}
     * @memberof BaseItem
     */
    behavior?: Behavior;

    /**
     * The event to call when this item is consumed.
     *
     * @type {string}
     * @memberof BaseItem
     */
    consumableEventToCall?: string;

    /**
     * The equipment type associated with this item.
     *
     * @type {EQUIPMENT_TYPE}
     * @memberof BaseItem
     */
    equipmentType?: EQUIPMENT_TYPE;
}

export type Item<Behavior = DefaultItemBehavior, CustomData = {}> = BaseItem<Behavior, CustomData> &
    StoredItem<CustomData>;
