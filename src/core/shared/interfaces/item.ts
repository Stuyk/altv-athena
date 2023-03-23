import * as alt from 'alt-shared';

/**
 * Default Weapon Data Information
 */
export type WeaponInfo = { hash: number; ammo: number; components?: Array<string | number> };

/**
 * An Item Drop that is represented on server s ide and client side.
 */
export type ItemDrop = {
    _id: unknown;
    pos: alt.IVector3;
    expiration: number;
    model?: string;
    name: string;
} & StoredItem;

/**
 * Default Clothing Information
 */
export type ClothingInfo = { sex: number; components: Array<ClothingComponent> };

/**
 * dlc information for given clothing data
 *
 * @export
 * @interface ClothingComponent
 */
export interface ClothingComponent {
    /**
     * The component identifier
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    id: number;

    /**
     * The associated relative drawing id for a given dlc clothing component
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    drawable: number;

    /**
     *
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    texture: number;

    /**
     *
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    palette?: number;

    /**
     *
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    dlc: number;

    /**
     *
     *
     * @type {boolean}
     * @memberof ClothingComponent
     */
    isProp?: boolean;
}

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
     * Used to state that an item is clothing.
     *
     * DO NOT specify isEquippable with this; leave it as false.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isClothing?: boolean;

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
     * DO NOT specify isEquippable with this; leave it as false.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isWeapon?: boolean;

    /**
     * Do not specify clothing, and weapon with this.
     *
     * Just only specify this one if doing custom equips.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isEquippable?: boolean;

    /**
     * Destroy this item on drop.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    destroyOnDrop?: boolean;

    /**
     * Override default icon behavior for items such as clothing.
     * Allows for specifying a custom icon instead.
     *
     * @type {boolean}
     * @memberof DefaultItemBehavior
     */
    isCustomIcon?: boolean;
}

/**
 * Interface for defining further custom context actions for items,
 * to show up when right-clicking on the item in inventory.
 */
export interface CustomContextAction {
    /**
     * The visible name of this action.
     */
    name: string,

    /**
     * The events which should be triggered.
     */
    eventToCall: string | Array<string>
}

/**
 * Shared Item Information for Both Interfaces Below
 *
 * @interface SharedItem
 * @template CustomData
 */
export interface SharedItem<CustomData = {}> {
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
     * A generic way to flag an item to be equipped.
     * Equipped can mean anything in the code base; it's up to the user to define its equip usage.
     *
     * @type {boolean}
     * @memberof StoredItem
     */
    isEquipped?: boolean;

    /**
     * The weight calculated for this item.
     *
     * @type {number}
     * @memberof StoredItem
     */
    totalWeight?: number;

    /**
     * Specify an icon to override the default base item icon with.
     *
     * @type {string}
     * @memberof StoredItem
     */
    icon?: string;

    /**
     * Flag this item as uncraftable. Just in case it has a shared base.
     *
     * @type {boolean}
     * @memberof StoredItem
     */
    disableCrafting?: boolean;
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
    consumableEventToCall?: string | Array<string>;

    /**
     * Custom context actions in addition to the standard consumable event.
     *
     * @type {string}
     * @memberof BaseItem
     */
    customEventsToCall?: Array<CustomContextAction>;

    /**
     * The drop model of this item when it is on the ground.
     * If not defined it will default to a box of some sort.
     *
     * @type {string}
     * @memberof BaseItem
     */
    model?: string;

    /**
     * An expiration time in milliseconds before the item drop is cleared.
     * Stored items come with an expiration date.
     *
     * @type {number}
     * @memberof BaseItem
     */
    msTimeout?: number;
}

export type Item<Behavior = DefaultItemBehavior, CustomData = {}> = BaseItem<Behavior, CustomData> &
    StoredItem<CustomData>;
