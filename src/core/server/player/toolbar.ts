import * as alt from 'alt-server';
import * as document from '@AthenaServer/document';
import * as Athena from '@AthenaServer/api';

import { StoredItem } from '@AthenaShared/interfaces/item';

/**
 * Add a new stored item to a user, must specify a quantity of greater than zero.
 * Toolbar only.
 *
 * @param {alt.Player} player
 * @param {Omit<StoredItem, 'slot'>} item
 * @return {Promise<boolean>}
 */
export async function add(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean> {
    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);
    if (typeof baseItem === 'undefined') {
        return false;
    }

    if (typeof data.toolbar === 'undefined') {
        data.toolbar = [];
    }

    const newToolbarData = Athena.systems.inventory.manager.add(item, data.toolbar, 'toolbar');
    if (typeof newToolbarData === 'undefined') {
        return false;
    }

    await document.character.set(player, 'toolbar', newToolbarData);
    return true;
}
/**
 * Subtract a quantity of an item from a player's toolbar.
 * Toolbar only.
 *
 * @param {alt.Player} player
 * @param {Omit<StoredItem, 'slot'>} item
 * @return {Promise<boolean>}
 */
export async function sub(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean> {
    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.toolbar === 'undefined') {
        return false;
    }

    const newToolbarData = Athena.systems.inventory.manager.sub(item, data.toolbar);
    if (typeof newToolbarData === 'undefined') {
        return false;
    }

    await document.character.set(player, 'toolbar', newToolbarData);
    return true;
}

/**
 * Delete an item in a specific slot in an toolbar data set.
 *
 * @param {alt.Player} player
 * @param {number} slot
 * @return {Promise<boolean>}
 */
export async function remove(player: alt.Player, slot: number): Promise<boolean> {
    const data = document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    if (typeof data.toolbar === 'undefined') {
        return false;
    }

    const newToolbarData = Athena.systems.inventory.slot.removeAt(slot, data.toolbar);
    if (typeof newToolbarData === 'undefined') {
        return false;
    }

    await document.character.set(player, 'toolbar', newToolbarData);
    return true;
}

interface ToolbarFunctions {
    add: typeof add;
    sub: typeof sub;
    remove: typeof remove;
}

const Overrides: Partial<ToolbarFunctions> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'sub', callback: typeof sub);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: keyof ToolbarFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
