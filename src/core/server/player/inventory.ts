import * as alt from 'alt-server';
import * as document from '@AthenaServer/document';
import * as Athena from '@AthenaServer/api';

import { StoredItem } from '@AthenaShared/interfaces/item';

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

interface InventoryFunctions {
    add: typeof add;
    sub: typeof sub;
    remove: typeof remove;
}

const Overrides: Partial<InventoryFunctions> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'sub', callback: typeof sub);
export function override(functionName: 'remove', callback: typeof remove);
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
