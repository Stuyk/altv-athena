import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { BaseItem, StoredItem, Item, DefaultItemBehavior } from '@AthenaShared/interfaces/item';
import { deepCloneArray, deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { GLOBAL_SYNCED } from '@AthenaShared/enums/globalSynced';

alt.setSyncedMeta(GLOBAL_SYNCED.INVENTORY_WEIGHT_ENABLED, true);

export interface ItemQuantityChange {
    /**
     * The modified item after making qunatity modifications to it.
     *
     * @type { Item | StoredItem }
     *
     */
    item: Item | StoredItem;

    /**
     * The number of items that were not added to this stack.
     *
     * @type {number}
     *
     */
    remaining: number;
}

export type InventoryType = 'inventory' | 'toolbar' | 'custom';
export type ComplexSwap = { slot: number; data: Array<StoredItem>; size: InventoryType | number; type: InventoryType };
export type ComplexSwapReturn = { from: Array<StoredItem>; to: Array<StoredItem> };

/**
 * Calculate the total weight of the item, and return the modified item with total weight.
 *
 * @param {BaseItem} baseItem
 * @param {StoredItem} storedItem
 * @returns {StoredItem}
 */
export function calculateItemWeight<CustomData = {}>(
    baseItem: BaseItem,
    storedItem: StoredItem<CustomData>,
): StoredItem<CustomData> {
    if (Overrides.calculateItemWeight) {
        return Overrides.calculateItemWeight(baseItem, storedItem);
    }

    if (typeof baseItem.weight === 'number' && storedItem.quantity !== 0) {
        const newItem = deepCloneObject<StoredItem<CustomData>>(storedItem);
        newItem.totalWeight = baseItem.weight * newItem.quantity;
        return newItem;
    }

    return storedItem;
}

/**
 * Modifies an item by adding or removing an amount.
 *
 * The amount that did not get removed, or added is returned.
 *
 * If the base item of the item is not found it will return undefined.
 *
 * It will automatically re-calculate weight if the baseItem weight is present.
 *
 * @param {ItemType} item
 * @param {number} amount
 * @param {boolean} [isRemoving=false]
 * @return {ItemQuantityChange}
 */
export function modifyItemQuantity(
    item: Item | StoredItem,
    amount: number,
    isRemoving: boolean = false,
): ItemQuantityChange {
    if (Overrides.modifyItemQuantity) {
        return Overrides.modifyItemQuantity(item, amount, isRemoving);
    }

    amount = Math.floor(amount);

    // Lookup the base item based on the dbName of the item.
    const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);
    if (typeof baseItem === 'undefined') {
        alt.logWarning(`ItemManager: Tried to lookup ${item.dbName}, but base item does not exist.`);
        return undefined;
    }

    // Prevent stacking / modifying quantity if adding to the item.
    if (!isRemoving && baseItem.behavior && !baseItem.behavior.canStack) {
        return undefined;
    }

    // Get the remaining that could not be added or removed due to either stack size, or not enough of this item to remove.
    let remaining = 0;
    if (isRemoving && item.quantity < amount) {
        remaining = amount - item.quantity;
        amount = item.quantity; // Set the amount to the item quantity since we are removing it all.
    }

    if (!isRemoving && typeof baseItem.maxStack === 'number' && item.quantity + amount > baseItem.maxStack) {
        remaining = item.quantity + amount - baseItem.maxStack;
        amount = baseItem.maxStack - item.quantity; // Set the amount to the total necessary to fulfill the maximum stack size.
    }

    // Add or remove quantity from the item
    let newItem = deepCloneObject<Item | StoredItem>(item);
    if (isRemoving) {
        newItem.quantity -= amount;
    } else {
        newItem.quantity += amount;
    }

    newItem = calculateItemWeight(baseItem, newItem);

    return {
        item: newItem,
        remaining,
    };
}

/**
 * Remove all items with zero quantity.
 *
 * @param {(Array<StoredItem | Item>)} items
 * @return {(Array<StoredItem | Item>)}
 */
export function removeZeroQuantityItems(items: Array<StoredItem | Item>): Array<StoredItem | Item> {
    if (Overrides.removeZeroQuantityItems) {
        return Overrides.removeZeroQuantityItems(items);
    }

    const newItemsArray = deepCloneArray<StoredItem | Item>(items);

    for (let i = newItemsArray.length - 1; i >= 0; i--) {
        if (typeof newItemsArray[i] === 'undefined') {
            continue;
        }

        if (newItemsArray[i].quantity > 0) {
            continue;
        }

        newItemsArray.splice(i, 1);
    }

    return newItemsArray;
}

/**
 * Adds a quantity to a specified item.
 * Utilizes the base item to determine maximum stack.
 * Will return the remaining amount that was not added if a max stack size is present.
 * Will return undefined if the base item does not exist, or if the item simply cannot have quantity changed.
 * Recalculated weight on item if baseItem has weight present.
 *
 * If you wish to modify a full item use `add<Item>(...)`
 *
 * @param {(Item | StoredItem)} item
 * @param {number} amount
 * @return {ItemType | undefined}
 */
export function addQuantity(item: Item | StoredItem, amount: number): ItemQuantityChange | undefined {
    if (Overrides.addQuantity) {
        return Overrides.addQuantity(item, amount);
    }

    return modifyItemQuantity(item, amount);
}

/**
 * Removes a quantity from a specified item.
 * Will return the remaining amount that was not removed if amount exceeds available in stack size.
 * Will return undefined if the base item does not exist, or if the item simply cannot have quantity changed.
 *
 * If you wish to modify a full item use `remove<Item>(...)`
 *
 * @param {(Item | StoredItem)} item
 * @param {number} amount
 * @return {ItemQuantityChange | undefined}
 */
export function subQuantity(item: Item | StoredItem, amount: number): ItemQuantityChange | undefined {
    if (Overrides.subQuantity) {
        return Overrides.subQuantity(item, amount);
    }

    return modifyItemQuantity(item, amount, true);
}

/**
 * Check if the player has enough of an item in a given data set.
 *
 * @param {Array<StoredItem>} dataSet
 * @param {string} dbName
 * @param {number} quantity
 * @param {number} [version=undefined]
 */
export function hasItem(
    dataSet: Array<StoredItem>,
    dbName: string,
    quantity: number,
    version: number = undefined,
): boolean {
    if (Overrides.hasItem) {
        return Overrides.hasItem(dataSet, dbName, quantity, version);
    }

    let count = 0;
    for (let item of dataSet) {
        if (item.dbName !== dbName) {
            continue;
        }

        if (item.version !== version) {
            continue;
        }

        count += item.quantity;
    }

    return count >= quantity;
}

export function upsertData<DataType = {}>(
    item: Item<DefaultItemBehavior, DataType> | StoredItem<DataType>,
    data: DataType,
) {
    if (Overrides.upsertData) {
        return Overrides.upsertData(item, data);
    }

    const newItem = deepCloneObject<Item<DefaultItemBehavior, DataType> | StoredItem<DataType>>(item);
    if (typeof newItem.data !== 'object') {
        newItem.data = {} as DataType;
    }

    newItem.data = Object.assign(newItem.data, data);
    return newItem;
}

/**
 * Assign data to the data field.
 *
 * Always returns a new item with the modified contents.
 *
 * @template DataType
 * @param {(Item<DefaultItemBehavior, DataType> | StoredItem<DataType>)} item
 * @param {DataType} data
 * @return {void}
 */
export function setData<DataType = {}>(
    item: Item<DefaultItemBehavior, DataType> | StoredItem<DataType>,
    data: DataType,
) {
    if (Overrides.setData) {
        return Overrides.setData(item, data);
    }

    const newItem = deepCloneObject<Item<DefaultItemBehavior, DataType> | StoredItem<DataType>>(item);
    if (typeof data === 'object') {
        newItem.data = deepCloneObject(data);
    }

    return newItem;
}

/**
 * Clears the data field of the item.
 * Sets it to an empty object.
 * Always returns a new item with the modified contents.
 *
 * @param {(Item | StoredItem)} item
 * @return {void}
 */
export function clearData(item: Item | StoredItem) {
    if (Overrides.clearData) {
        return Overrides.clearData(item);
    }

    const newItem = deepCloneObject<Item | StoredItem>(item);
    newItem.data = {};
    return newItem;
}

/**
 * Convert an array of stored items into full items
 *
 *
 * @param {Array<StoredItem<{}>>} data
 * @return {Array<Item<DefaultItemBehavior, {}>>}
 */
export function convertFromStored<CustomData = {}>(
    data: Array<StoredItem<CustomData>>,
): Array<Item<DefaultItemBehavior, CustomData>> {
    if (Overrides.convertFromStored) {
        return Overrides.convertFromStored(data);
    }

    const convertedItemList: Array<Item<DefaultItemBehavior, CustomData>> = [];

    for (let i = 0; i < data.length; i++) {
        const convertedItem = Athena.systems.inventory.factory.fromStoredItem<CustomData>(data[i]);
        convertedItemList.push(convertedItem);
    }

    return convertedItemList;
}

/**
 * Adds or stacks an item based on the quantity passed.
 * Requires the basic version of a stored item to be added to a user.
 * Returns undefined if the data set could not be modified to include the quantity of items necessary.
 *
 * @param {Array<StoredItem<CustomData>>} data
 * @param {number} amount
 * @param {InventoryType | number} size The maximum slot size for this item group.
 * @return {Array<StoredItem>} Returns undefined or the new array of added items.
 */
export function add<CustomData = {}>(
    item: Omit<StoredItem<CustomData>, 'slot'>,
    data: Array<StoredItem<CustomData>>,
    size: InventoryType | number = 256,
): Array<StoredItem<CustomData>> | undefined {
    if (Overrides.add) {
        return Overrides.add(item, data, size);
    }

    if (item.quantity <= 0) {
        alt.logWarning(`ItemManager: Cannot add negative quantity, or zero quantity to an item.`);
        return undefined;
    }

    if (item.quantity === 0) {
        return Athena.systems.inventory.weight.update<CustomData>(data);
    }

    // Lookup the base item based on the dbName of the item.
    const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);
    if (typeof baseItem === 'undefined') {
        alt.logWarning(`ItemManager: Tried to lookup ${item.dbName}, but base item does not exist.`);
        return undefined;
    }

    const actualMaxStack = baseItem.maxStack ? baseItem.maxStack : 512;
    const copyOfData = deepCloneArray<StoredItem<CustomData>>(data);
    let availableStackIndex = -1;
    if (baseItem.behavior.canStack && actualMaxStack > 1) {
        availableStackIndex = copyOfData.findIndex(
            (x) => x.dbName === item.dbName && x.version === item.version && x.quantity !== actualMaxStack,
        );
    }

    // Handles the following:
    // - Adds unstackable items
    // - Adds an item with a max stack of 1
    // - Adds stackable items, and automatically tries to fill item quantity.
    if (!baseItem.behavior.canStack || actualMaxStack === 1 || availableStackIndex === -1) {
        // Ensure there is enough room to add items.
        if (copyOfData.length >= parseFloat(String(size))) {
            return undefined;
        }

        // Determine open slot for item.
        // If undefined; do not try to add anything else; return undefined as a failure.
        const openSlot = Athena.systems.inventory.slot.findOpen(size, copyOfData);
        if (typeof openSlot === 'undefined') {
            return undefined;
        }

        let itemClone = deepCloneObject<StoredItem<CustomData>>(item);
        itemClone.slot = openSlot;

        // Use quantity to subtract from max stack size or use amount left
        if (baseItem.behavior.canStack) {
            itemClone.quantity = item.quantity < actualMaxStack ? item.quantity : actualMaxStack;
            item.quantity -= itemClone.quantity;
        } else {
            itemClone.quantity = 1;
            item.quantity -= 1;
        }

        copyOfData.push(itemClone);

        if (item.quantity === 0) {
            return Athena.systems.inventory.weight.update<CustomData>(copyOfData);
        }

        return add(item, copyOfData, size);
    }

    // If the item.quantity is less than the stack size and less than or equal to amount missing. Simply add to it.
    const amountMissing = actualMaxStack - copyOfData[availableStackIndex].quantity;
    if (item.quantity <= amountMissing) {
        copyOfData[availableStackIndex].quantity += item.quantity;
        copyOfData[availableStackIndex] = calculateItemWeight(baseItem, copyOfData[availableStackIndex]);

        return copyOfData;
    }

    // Otherwise add the amount missing to this stack.
    // Subtract amount missing from original item quantity.
    // Call the same function again.
    copyOfData[availableStackIndex].quantity += amountMissing;
    copyOfData[availableStackIndex] = calculateItemWeight(baseItem, copyOfData[availableStackIndex]);

    item.quantity -= amountMissing;
    return add(item, copyOfData, size);
}

/**
 * Subtract an item quantity from a data set.
 *
 * @template CustomData
 * @param {StoredItem<CustomData>} item
 * @param {Array<StoredItem>} data
 * @return {(Array<StoredItem> | undefined)}
 */
export function sub<CustomData = {}>(
    item: Omit<StoredItem<CustomData>, 'slot' | 'data'>,
    data: Array<StoredItem>,
): Array<StoredItem> | undefined {
    if (Overrides.sub) {
        return Overrides.sub(item, data);
    }

    if (item.quantity <= -1) {
        alt.logWarning(`ItemManager: Cannot subtract negative quantity from an item.`);
        return undefined;
    }

    if (item.quantity === 0) {
        return data;
    }

    // Lookup the base item based on the dbName of the item.
    const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);
    if (typeof baseItem === 'undefined') {
        alt.logWarning(`ItemManager: Tried to lookup ${item.dbName}, but base item does not exist.`);
        return undefined;
    }

    const copyOfData = deepCloneArray<StoredItem>(data);
    const existingItemIndex = copyOfData.findIndex((x) => x.dbName === item.dbName && x.version === item.version);

    // Pretty much means there are not more items to remove from.
    // Return undefined.
    if (existingItemIndex <= -1) {
        return undefined;
    }

    // If the item we are removing from does not have enough quantity
    // Get the amount we are going to remove.
    // Remove that item from the data set.
    // Repeat subtraction of item.

    // The item quantity that we looked up is less than the amount we want to remove.
    // Recursively repeat removing until all are removed.
    if (copyOfData[existingItemIndex].quantity <= item.quantity) {
        item.quantity -= copyOfData[existingItemIndex].quantity;
        copyOfData.splice(existingItemIndex, 1);
        return sub(item, copyOfData);
    }

    // If the quantity of the found item is greater than; subtract necessary amount.
    copyOfData[existingItemIndex].quantity -= item.quantity;
    return Athena.systems.inventory.weight.update(copyOfData);
}

/**
 * Split an item into a new item given the slot number, and a split size.
 *
 * @param {number} slot
 * @param {Array<StoredItem>} data
 * @param {number} splitCount
 * @param {(InventoryType | number)} [size=DEFAULT_CONFIG.custom.size]
 */
export function splitAt<CustomData = {}>(
    slot: number,
    data: Array<StoredItem<CustomData>>,
    splitCount: number,
    dataSize: InventoryType | number = Athena.systems.inventory.config.get().custom.size,
): Array<StoredItem<CustomData>> | undefined {
    if (Overrides.splitAt) {
        return Overrides.splitAt(slot, data, splitCount, dataSize);
    }

    if (splitCount <= 0) {
        return undefined;
    }

    let copyOfData = deepCloneArray<StoredItem<CustomData>>(data);
    if (typeof dataSize === 'string') {
        dataSize = Athena.systems.inventory.config.get()[dataSize].size;
    }

    if (data.length >= dataSize) {
        return undefined;
    }

    const index = copyOfData.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return undefined;
    }

    const openSlot = Athena.systems.inventory.slot.findOpen(dataSize, copyOfData);
    if (typeof openSlot === 'undefined') {
        return undefined;
    }

    const baseItem = Athena.systems.inventory.factory.getBaseItem(copyOfData[index].dbName, copyOfData[index].version);

    if (typeof baseItem === 'undefined') {
        alt.logWarning(`ItemManager: Tried to lookup ${copyOfData[index].dbName}, but base item does not exist.`);
        return undefined;
    }

    if (splitCount >= copyOfData[index].quantity) {
        return undefined;
    }

    // Create copy of item, set quantity to split count.
    let itemClone = deepCloneObject<StoredItem<CustomData>>(copyOfData[index]);
    itemClone.quantity = splitCount;
    itemClone.slot = openSlot;
    itemClone = calculateItemWeight(baseItem, itemClone);

    // Remove quantity from existing item based on split count.
    copyOfData[index].quantity -= splitCount;
    copyOfData.push(itemClone);

    return Athena.systems.inventory.weight.update<CustomData>(copyOfData);
}

/**
 * Combines items from two different slots into a single slot.
 * It's like a stack method.
 *
 * @param {number} fromSlot
 * @param {number} toSlot
 * @param {Array<StoredItem>} data
 * @return {(Array<StoredItem> | undefined)}
 */
export function combineAt<CustomData = {}>(
    fromSlot: number,
    toSlot: number,
    data: Array<StoredItem<CustomData>>,
): Array<StoredItem<CustomData>> | undefined {
    if (Overrides.combineAt) {
        return Overrides.combineAt(fromSlot, toSlot, data);
    }

    const fromIndex = data.findIndex((x) => x.slot === fromSlot);
    const toIndex = data.findIndex((x) => x.slot === toSlot);

    if (fromIndex === -1 || toIndex === -1) {
        return undefined;
    }

    if (data[fromIndex].dbName !== data[toIndex].dbName) {
        return undefined;
    }

    if (data[fromIndex].version !== data[toIndex].version) {
        return undefined;
    }

    const baseItem = Athena.systems.inventory.factory.getBaseItem(data[toIndex].dbName, data[toIndex].version);
    if (typeof baseItem === 'undefined') {
        alt.logWarning(`ItemManager: Tried to lookup ${data[toIndex].dbName}, but base item does not exist.`);
        return undefined;
    }

    if (baseItem.behavior && !baseItem.behavior.canStack) {
        return undefined;
    }

    let copyOfData = deepCloneArray<StoredItem<CustomData>>(data);
    if (copyOfData[toIndex].quantity === baseItem.maxStack) {
        return undefined;
    }

    if (copyOfData[fromIndex].quantity + copyOfData[toIndex].quantity <= baseItem.maxStack) {
        copyOfData[toIndex].quantity += copyOfData[fromIndex].quantity;
        copyOfData.splice(fromIndex, 1);
        return Athena.systems.inventory.weight.update<CustomData>(copyOfData);
    }

    const spaceAvailable = baseItem.maxStack - copyOfData[toIndex].quantity;
    copyOfData[fromIndex].quantity -= spaceAvailable;
    copyOfData[toIndex].quantity += spaceAvailable;

    return Athena.systems.inventory.weight.update<CustomData>(copyOfData);
}

export function combineAtComplex(from: ComplexSwap, to: ComplexSwap): ComplexSwapReturn | undefined {
    if (Overrides.combineAtComplex) {
        return Overrides.combineAtComplex(from, to);
    }

    if (typeof from.size === 'string') {
        from.size = Athena.systems.inventory.config.get()[from.size].size;
    }

    if (typeof to.size === 'string') {
        to.size = Athena.systems.inventory.config.get()[to.size].size;
    }

    const fromIndex = from.data.findIndex((x) => x.slot === from.slot);
    const toIndex = to.data.findIndex((x) => x.slot === to.slot);

    if (fromIndex <= -1) {
        return undefined;
    }

    const fromData = deepCloneArray<StoredItem>(from.data);
    const toData = deepCloneArray<StoredItem>(to.data);

    const baseItem = Athena.systems.inventory.factory.getBaseItem(
        fromData[fromIndex].dbName,
        fromData[fromIndex].version,
    );
    if (typeof baseItem === 'undefined') {
        return undefined;
    }

    if (baseItem.behavior && !baseItem.behavior.canStack) {
        return undefined;
    }

    const maxStackSize = typeof baseItem.maxStack === 'number' ? baseItem.maxStack : Number.MAX_SAFE_INTEGER;
    const spaceAvailable = maxStackSize - toData[toIndex].quantity;

    if (spaceAvailable <= 0) {
        return undefined;
    }

    // Quantity being moved, smaller than max stack but also enough room for whole stack.
    // Simply move quantities; and return results.
    if (spaceAvailable > fromData[fromIndex].quantity) {
        toData[toIndex].quantity += fromData[fromIndex].quantity;
        fromData.splice(fromIndex, 1);
        return {
            from: Athena.systems.inventory.weight.update(fromData),
            to: Athena.systems.inventory.weight.update(toData),
        };
    }

    fromData[fromIndex].quantity -= spaceAvailable;
    toData[toIndex].quantity += spaceAvailable;
    return {
        from: Athena.systems.inventory.weight.update(fromData),
        to: Athena.systems.inventory.weight.update(toData),
    };
}

/**
 * Swaps slots between a single data set.
 *
 * @param {number} fromSlot
 * @param {number} toSlot
 * @param {Array<StoredItem>} data
 * @param {}
 * @return {(Array<StoredItem> | undefined)}
 */
export function swap(
    fromSlot: number,
    toSlot: number,
    data: Array<StoredItem>,
    dataSize: InventoryType | number = Athena.systems.inventory.config.get().custom.size,
): Array<StoredItem> | undefined {
    if (Overrides.swap) {
        return Overrides.swap(fromSlot, toSlot, data, dataSize);
    }

    const startIndex = data.findIndex((x) => x.slot === fromSlot);
    const endIndex = data.findIndex((x) => x.slot === toSlot);

    // Force data set sizing based on configuration.
    if (typeof dataSize === 'string') {
        dataSize = Athena.systems.inventory.config.get()[dataSize].size;
    }

    if (toSlot > dataSize) {
        return undefined;
    }

    if (startIndex <= -1) {
        return undefined;
    }

    if (startIndex === endIndex) {
        return undefined;
    }

    // Simply swap the slots.
    let copyOfData = deepCloneArray<StoredItem>(data);
    copyOfData[startIndex].slot = toSlot;

    if (endIndex !== -1) {
        copyOfData[endIndex].slot = fromSlot;
    }

    return Athena.systems.inventory.weight.update(copyOfData);
}

/**
 * Swap items between two different data sets; with a given size.
 *
 * @param {ComplexSwap} from
 * @param {ComplexSwap} to
 * @return {(ComplexSwapReturn | undefined)}
 */
export function swapBetween(from: ComplexSwap, to: ComplexSwap): ComplexSwapReturn | undefined {
    if (Overrides.swapBetween) {
        return Overrides.swapBetween(from, to);
    }

    if (typeof from.size === 'string') {
        from.size = Athena.systems.inventory.config.get()[from.size].size;
    }

    if (typeof to.size === 'string') {
        to.size = Athena.systems.inventory.config.get()[to.size].size;
    }

    const fromIndex = from.data.findIndex((x) => x.slot === from.slot);
    const toIndex = to.data.findIndex((x) => x.slot === to.slot);

    if (fromIndex <= -1) {
        return undefined;
    }

    if (to.slot > to.size) {
        return undefined;
    }

    let fromData = deepCloneArray<StoredItem>(from.data);
    let toData = deepCloneArray<StoredItem>(to.data);

    // Clone of the original items, if the item is available.
    let fromItem = deepCloneObject<StoredItem>(fromData[fromIndex]);
    const fromBaseItem = Athena.systems.inventory.factory.getBaseItem(fromItem.dbName, fromItem.version);
    if (to.type === 'toolbar' && fromBaseItem && fromBaseItem.behavior && !fromBaseItem.behavior.isToolbar) {
        return undefined;
    }

    let toItem: StoredItem;
    if (toIndex !== -1) {
        toItem = deepCloneObject<StoredItem>(toData[toIndex]);
        const toBaseItem = Athena.systems.inventory.factory.getBaseItem(toItem.dbName, toItem.version);
        if (from.type === 'toolbar' && toBaseItem && toBaseItem.behavior && !toBaseItem.behavior.isToolbar) {
            return undefined;
        }

        if (from.type === 'toolbar' && toBaseItem.behavior.isWeapon) {
            toItem.isEquipped = false;
        }

        toItem.slot = from.slot;
        toData.splice(toIndex, 1);

        // Move the 'to' item to the other data set.
        fromData.push(toItem);
    }

    fromData.splice(fromIndex, 1);
    fromItem.slot = to.slot;

    if (to.type === 'toolbar' || from.type === 'toolbar') {
        fromItem.isEquipped = false;
    }

    // Move the 'from' item to the other data set.
    toData.push(fromItem);
    return {
        from: Athena.systems.inventory.weight.update(fromData),
        to: Athena.systems.inventory.weight.update(toData),
    };
}

/**
 * Invokes an item use effect
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} slot
 * @param {('inventory' | 'toolbar')} [type='toolbar']
 * @return {void}
 */
export async function useItem(
    player: alt.Player,
    slot: number,
    type: 'inventory' | 'toolbar' = 'toolbar',
    eventToCall: string | string[] = undefined,
) {
    if (Overrides.useItem) {
        return Overrides.useItem(player, slot, type, eventToCall);
    }

    if (!player || !player.valid) {
        return;
    }

    if (typeof slot !== 'number') {
        return;
    }

    const data = Athena.document.character.get(player);
    if (typeof data[type] === 'undefined') {
        return;
    }

    const storedItem = Athena.systems.inventory.slot.getAt(slot, data[type]);
    if (typeof storedItem === 'undefined') {
        return;
    }

    const baseItem = Athena.systems.inventory.factory.getBaseItem(storedItem.dbName, storedItem.version);
    if (typeof baseItem === 'undefined') {
        return;
    }

    if (baseItem.behavior && baseItem.behavior.isWeapon && !baseItem.behavior.isEquippable) {
        await toggleItem(player, slot, type);
        Athena.systems.inventory.weapons.update(player);
    }

    if (baseItem.behavior && baseItem.behavior.isClothing && !baseItem.behavior.isEquippable) {
        await toggleItem(player, slot, type);
    }

    if (
        baseItem.behavior &&
        baseItem.behavior.isEquippable &&
        !baseItem.behavior.isWeapon &&
        !baseItem.behavior.isClothing
    ) {
        await toggleItem(player, slot, type);
    }

    if (!baseItem.consumableEventToCall && !eventToCall) {
        return;
    }

    Athena.systems.inventory.effects.invoke(player, slot, type, eventToCall);
}

/**
 * Toggles the isEquipped boolean in a stored item.
 * If the boolean is undefined; it will change to true.
 * Automatically saves.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} slot
 * @return {Promise<boolean>}
 */
export async function toggleItem(player: alt.Player, slot: number, type: InventoryType): Promise<boolean> {
    if (Overrides.toggleItem) {
        return Overrides.toggleItem(player, slot, type);
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined' || typeof data[type] === 'undefined') {
        return false;
    }

    const dataCopy = deepCloneArray<StoredItem<{ sex?: number; hash?: number; ammo?: number }>>(data[type]);
    const index = dataCopy.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return false;
    }

    // Verify player model locked items
    let shouldUpdateClothing = false;
    if (dataCopy[index].data && typeof dataCopy[index].data.sex !== 'undefined') {
        if (dataCopy[index].data.sex !== data.appearance.sex) {
            return false;
        }

        shouldUpdateClothing = true;
    }

    if (type === 'toolbar') {
        for (let i = 0; i < dataCopy.length; i++) {
            if (typeof dataCopy[i].data === 'undefined' || typeof dataCopy[i].data.hash === 'undefined') {
                continue;
            }

            if (!dataCopy[i].isEquipped) {
                continue;
            }

            if (i === index) {
                continue;
            }

            dataCopy[i].isEquipped = false;
            Athena.player.events.trigger('player-weapon-unequipped', player, dataCopy[i].slot, type);
        }
    }

    dataCopy[index].isEquipped = !dataCopy[index].isEquipped ? true : false;
    await Athena.document.character.set(player, type, dataCopy);

    const baseItem = Athena.systems.inventory.factory.getBaseItem(dataCopy[index].dbName, dataCopy[index].version);
    if (baseItem && baseItem.behavior && baseItem.behavior.isWeapon && dataCopy[index].isEquipped === false) {
        Athena.player.events.trigger('player-weapon-unequipped', player, dataCopy[index].slot, type);
    }

    const eventToTrigger = dataCopy[index].isEquipped ? 'item-equipped' : 'item-unequipped';
    Athena.player.events.trigger(eventToTrigger, player, dataCopy[index].slot, type);

    if (type === 'toolbar') {
        Athena.player.emit.sound2D(player, dataCopy[index].isEquipped ? 'item_equip' : 'item_remove', 0.2);
    }

    if (shouldUpdateClothing) {
        Athena.systems.inventory.clothing.update(player);
    }

    return true;
}

/**
 * Compare two items to check if they are the same version.
 *
 * @param {StoredItem} firstItem
 * @param {StoredItem} secondItem
 * @return {boolean}
 */
export function compare(firstItem: StoredItem, secondItem: StoredItem): boolean {
    if (Overrides.compare) {
        return Overrides.compare(firstItem, secondItem);
    }

    const firstUndefined = typeof firstItem === 'undefined';
    const secUndefined = typeof secondItem === 'undefined';

    if (firstUndefined && secUndefined) {
        return false;
    }

    if (!firstUndefined && secUndefined) {
        return false;
    }

    if (firstUndefined && !secUndefined) {
        return false;
    }

    if (firstItem.dbName !== secondItem.dbName) {
        return false;
    }

    return firstItem.version === secondItem.version;
}

interface ManagerFuncs {
    add: typeof add;
    addQuantity: typeof addQuantity;
    calculateItemWeight: typeof calculateItemWeight;
    clearData: typeof clearData;
    combineAt: typeof combineAt;
    combineAtComplex: typeof combineAtComplex;
    compare: typeof compare;
    convertFromStored: typeof convertFromStored;
    hasItem: typeof hasItem;
    modifyItemQuantity: typeof modifyItemQuantity;
    removeZeroQuantityItems: typeof removeZeroQuantityItems;
    setData: typeof setData;
    splitAt: typeof splitAt;
    sub: typeof sub;
    subQuantity: typeof subQuantity;
    swap: typeof swap;
    swapBetween: typeof swapBetween;
    toggleItem: typeof toggleItem;
    upsertData: typeof upsertData;
    useItem: typeof useItem;
}

const Overrides: Partial<ManagerFuncs> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'addQuantity', callback: typeof addQuantity);
export function override(functionName: 'calculateItemWeight', callback: typeof calculateItemWeight);
export function override(functionName: 'clearData', callback: typeof clearData);
export function override(functionName: 'combineAt', callback: typeof combineAt);
export function override(functionName: 'combineAtComplex', callback: typeof combineAtComplex);
export function override(functionName: 'compare', callback: typeof compare);
export function override(functionName: 'convertFromStored', callback: typeof convertFromStored);
export function override(functionName: 'hasItem', callback: typeof hasItem);
export function override(functionName: 'modifyItemQuantity', callback: typeof modifyItemQuantity);
export function override(functionName: 'removeZeroQuantityItems', callback: typeof removeZeroQuantityItems);
export function override(functionName: 'setData', callback: typeof setData);
export function override(functionName: 'splitAt', callback: typeof splitAt);
export function override(functionName: 'sub', callback: typeof sub);
export function override(functionName: 'subQuantity', callback: typeof subQuantity);
export function override(functionName: 'swap', callback: typeof swap);
export function override(functionName: 'swapBetween', callback: typeof swapBetween);
export function override(functionName: 'toggleItem', callback: typeof toggleItem);
export function override(functionName: 'upsertData', callback: typeof upsertData);
export function override(functionName: 'useItem', callback: typeof useItem);
/**
 * Used to override inventory item manager functionality
 *
 *
 * @param {keyof ManagerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof ManagerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
