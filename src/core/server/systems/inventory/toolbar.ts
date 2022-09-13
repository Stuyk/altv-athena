import * as alt from 'alt-server';
import { EQUIPMENT_TYPE } from '../../../shared/enums/equipmentType';
import { CharacterInventory, Item } from '../../../shared/interfaces/inventory';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { Athena } from '../../api/athena';
import { StateManager } from '../stateManager';
import Inventory from './inventory';
import Shared from './shared';

const MAXIMUM_SLOTS = 4;

/**
 * Try removing the item from the inventory, and if it succeeds, add it to the toolbar.
 * The function is async, so it returns a promise.
 *
 * @param {CharacterInventory | Pick<alt.Player, 'data'>} player - CharacterInventory | Pick<alt.Player, 'data'>
 * @param {Item} item - Item - The item that you want to equip.
 * @returns {boolean}
 */
async function justEquip(player: CharacterInventory | Pick<alt.Player, 'data'>, item: Item): Promise<boolean> {
    const toolbarItems = [...player.data.toolbar] as Array<Item>;
    const availableSlot = Shared.findAvailableSlot(player, 'toolbar', MAXIMUM_SLOTS);
    if (typeof availableSlot === 'undefined') {
        return false;
    }

    // Removes item from inventory, and auto-updates state
    const removedItem = await Inventory.remove(player, item.slot);
    if (typeof removedItem === 'boolean' && removedItem === false) {
        return false;
    }

    // Clone the original item... and assign the new slot for the toolbar.
    const itemClone = deepCloneObject<Item>(item);
    itemClone.slot = availableSlot;
    toolbarItems.push(itemClone);
    await StateManager.set(player, 'toolbar', toolbarItems);
    Athena.player.sync.inventory(player as alt.Player);
    return true;
}

/**
 * Takes an inventory item and tries to equip it as an toolbar item.
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {number} inventorySlot
 * @return {Promise<boolean>}
 */
async function equip(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    inventorySlot: number,
    toolbarSlot: number | undefined = undefined,
): Promise<boolean> {
    if (typeof player.data.inventory === 'undefined') {
        player.data.inventory = [];
        return false;
    }

    // Maxed out slots...
    const toolbarItems = [...player.data.toolbar] as Array<Item>;
    if (toolbarItems.length >= 4) {
        return false;
    }

    // WIP
    return true;
}

const Toolbar = {
    justEquip,
};

function override<Key extends keyof typeof Toolbar>(functionName: Key, callback: typeof Toolbar[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        return;
    }

    exports[functionName] = callback;
}

const exports: typeof Toolbar & { override?: typeof override } = {
    ...Toolbar,
    override,
};

export default exports;
