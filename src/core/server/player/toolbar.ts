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
    if (Overrides.sub) {
        return Overrides.sub(player, item);
    }

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
    if (Overrides.remove) {
        return Overrides.remove(player, slot);
    }

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

/**
 * Verify that the player has at least 'x' of an item in their toolbar
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

    if (typeof data.toolbar === 'undefined') {
        return false;
    }

    return Athena.systems.inventory.manager.hasItem(data.toolbar, dbName, quantity, version);
}

interface ToolbarFunctions {
    add: typeof add;
    has: typeof has;
    sub: typeof sub;
    remove: typeof remove;
}

const Overrides: Partial<ToolbarFunctions> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'has', callback: typeof has);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'sub', callback: typeof sub);
/**
 * Used to override any toolbar functions
 *
 * @export
 * @param {keyof ToolbarFunctions} functionName
 * @param {*} callback
 */
export function override(functionName: keyof ToolbarFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
