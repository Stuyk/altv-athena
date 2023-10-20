import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { StoredItem } from '@AthenaShared/interfaces/item.js';

/**
 * Return all weapons the player currently has in their inventory, and toolbar.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {{ inventory: Array<StoredItem>; toolbar: Array<StoredItem> }}
 */
export function get(player: alt.Player): { inventory: Array<StoredItem>; toolbar: Array<StoredItem> } {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return { inventory: [], toolbar: [] };
    }

    if (!data.toolbar) {
        data.toolbar = [];
    }

    if (!data.inventory) {
        data.inventory = [];
    }

    return {
        inventory: Athena.systems.inventory.weapons.get(data.inventory),
        toolbar: Athena.systems.inventory.weapons.get(data.toolbar),
    };
}

/**
 * Clear all weapons from a player's inventory.
 *
 * Returns true if weapons were found and removed.
 *
 * @param {alt.Player} player An alt:V Player Entity
 *
 */
export async function clear(player: alt.Player): Promise<boolean> {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return undefined;
    }

    if (!data.toolbar) {
        data.toolbar = [];
    }

    if (!data.inventory) {
        data.inventory = [];
    }

    if (data.toolbar.length <= 0 && data.inventory.length <= 0) {
        return false;
    }

    let inventoryLength = data.inventory.length;
    let toolbarLength = data.toolbar.length;

    const newInventory = Athena.systems.inventory.weapons.removeAll(data.inventory);
    const newToolbar = Athena.systems.inventory.weapons.removeAll(data.toolbar);

    if (inventoryLength === newInventory.length && toolbarLength === newToolbar.length) {
        return false;
    }

    await Athena.document.character.setBulk(player, { toolbar: newToolbar, inventory: newInventory });
    return true;
}
