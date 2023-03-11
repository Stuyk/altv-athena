import * as alt from 'alt-server';
import * as document from '@AthenaServer/document';
import * as Athena from '@AthenaServer/api';

import { StoredItem } from '@AthenaShared/interfaces/item';
import { deepCloneArray } from '@AthenaShared/utility/deepCopy';

/**
 * Add a new stored item to a user, must specify a quantity of greater than zero.
 * Automatically checks weight upon new item additions. Exceeding the weight; cancels the add.
 * Does not look into toolbar.
 *
 * @param {alt.Player} player
 * @param {Omit<StoredItem, 'slot'>} item
 * @return {Promise<boolean>}
 */
export async function add(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean> {
    if (Overrides.add) {
        return Overrides.add(player, item);
    }

    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);
    if (typeof baseItem === 'undefined') {
        return false;
    }

    if (typeof data.inventory === 'undefined') {
        data.inventory = [];
    }

    item.data = Object.assign(baseItem.data, item.data);
    const newInventoryData = Athena.systems.inventory.manager.add(item, data.inventory, 'inventory');
    if (typeof newInventoryData === 'undefined') {
        return false;
    }

    if (Athena.systems.inventory.weight.isWeightExceeded([newInventoryData, data.toolbar])) {
        return false;
    }

    await document.character.set(player, 'inventory', newInventoryData);
    return true;
}

/**
 * Subtract a quantity of an item from a player's inventory.
 * Does not look into toolbar.
 *
 * @param {alt.Player} player
 * @param {Omit<StoredItem, 'slot'>} item
 * @return {Promise<boolean>}
 */
export async function sub(player: alt.Player, item: Omit<StoredItem, 'slot' | 'data'>): Promise<boolean> {
    if (Overrides.sub) {
        return Overrides.sub(player, item);
    }

    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.inventory === 'undefined') {
        return false;
    }

    const newInventoryData = Athena.systems.inventory.manager.sub(item, data.inventory);
    if (typeof newInventoryData === 'undefined') {
        return false;
    }

    await document.character.set(player, 'inventory', newInventoryData);
    return true;
}

/**
 * Delete an item in a specific slot in an inventory data set.
 * Does not look into toolbar.
 *
 * @param {alt.Player} player
 * @param {number} slot
 * @return {Promise<boolean>}
 */
export async function remove(player: alt.Player, slot: number): Promise<boolean> {
    if (Overrides.remove) {
        return Overrides.remove(player, slot);
    }

    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.inventory === 'undefined') {
        return false;
    }

    const newInventoryData = Athena.systems.inventory.slot.removeAt(slot, data.inventory);
    if (typeof newInventoryData === 'undefined') {
        return false;
    }

    await document.character.set(player, 'inventory', newInventoryData);
    return true;
}

/**
 * Verify that the player has at least 'x' of an item in their inventory
 *
 * @export
 * @param {alt.Player} player
 * @param {string} baseItem
 * @return {*}
 */
export async function has(player: alt.Player, dbName: string, quantity: number, version = undefined) {
    if (Overrides.has) {
        return Overrides.has(player, dbName, quantity, version);
    }

    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.inventory === 'undefined') {
        return false;
    }

    return Athena.systems.inventory.manager.hasItem(data.inventory, dbName, quantity, version);
}

/**
 * Returns the custom item data assigned to a specific item.
 *
 * Will return undefined if the custom data is not available.
 *
 * @export
 * @template CustomData
 * @param {alt.Player} player
 * @param {number} slot
 * @return {CustomData}
 */
export function getItemData<CustomData = {}>(player: alt.Player, slot: number): CustomData | undefined {
    if (Overrides.getItemData) {
        return Overrides.getItemData(player, slot);
    }

    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return undefined;
    }

    if (typeof data.inventory === 'undefined') {
        return undefined;
    }

    const index = data.inventory.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return undefined;
    }

    return data.inventory[index].data ? (data.inventory[index].data as CustomData) : undefined;
}

/**
 * Find an item at a specific slot, and changes its entire custom data section.
 *
 * Think of this like an easy to use 'setter' for item data.
 *
 * @export
 * @template CustomData
 * @param {alt.Player} player
 * @param {number} slot
 * @param {CustomData} data
 * @return {Promise<boolean>}
 */
export async function modifyItemData<CustomData = {}>(
    player: alt.Player,
    slot: number,
    customData: CustomData,
): Promise<boolean> {
    if (Overrides.modifyItemData) {
        return await Overrides.modifyItemData(player, slot, customData);
    }

    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.inventory === 'undefined') {
        return false;
    }

    const inventoryRef = deepCloneArray<StoredItem>(data.inventory);
    const index = inventoryRef.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return false;
    }

    inventoryRef[index].data = customData;
    await document.character.set(player, 'inventory', inventoryRef);
    return true;
}

interface InventoryFunctions {
    add: typeof add;
    has: typeof has;
    remove: typeof remove;
    sub: typeof sub;
    modifyItemData: typeof modifyItemData;
    getItemData: typeof getItemData;
}

const Overrides: Partial<InventoryFunctions> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'has', callback: typeof has);
export function override(functionName: 'sub', callback: typeof sub);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'modifyItemData', callback: typeof modifyItemData);
export function override(functionName: 'getItemData', callback: typeof getItemData);
/**
 * Used to override any internal inventory functions
 *
 * @export
 * @param {keyof InventoryFunctions} functionName
 * @param {*} callback
 */
export function override(functionName: keyof InventoryFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
