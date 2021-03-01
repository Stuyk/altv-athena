import * as alt from 'alt-server';
import { EquipmentType } from '../../../shared/enums/equipment';
import { ItemType } from '../../../shared/enums/itemType';
import { Item } from '../../../shared/interfaces/Item';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../../shared/utility/flags';
import save from './save';
import sync from './sync';

/**
 * Return the tab index and the slot to use for the item.
 * @return {*}  {({ tab: number; index: number } | null)}
 * @memberof InventoryPrototype
 */
function getFreeInventorySlot(p: alt.Player, tabNumber: number = null): { tab: number; slot: number } | null {
    for (let i = 0; i < p.data.inventory.length; i++) {
        if (tabNumber !== null && i !== tabNumber) {
            continue;
        }

        const tab = p.data.inventory[i];

        // Go to next tab if inventory is full.
        if (tab.length >= 28) {
            continue;
        }

        // x is the free slot to assign the item
        for (let x = 0; x < 28; x++) {
            const itemIndex = tab.findIndex((item) => item.slot === x);
            if (itemIndex >= 0) {
                continue;
            }

            return { tab: i, slot: x };
        }
    }

    return null;
}

/**
 * If the player has an item type anywhere in their inventory.
 * @param {Partial<Item>} item
 */
function hasItem(player: alt.Player, item: Partial<Item>): boolean {
    let hasInInventory = isInInventory(player, item);
    if (hasInInventory) {
        return true;
    }

    let hasInToolbar = isInToolbar(player, item);
    if (hasInInventory) {
        return true;
    }

    return false;
}

/**
 * Check if a player has a weapon.
 * @param {alt.Player} player
 */
function hasWeapon(player: alt.Player): Item | null {
    for (let t = 0; t < player.data.inventory.length; t++) {
        const tab = player.data.inventory[t];

        if (tab.length <= 0) {
            continue;
        }

        for (let i = 0; i < tab.length; i++) {
            const inventoryItem = tab[i];
            if (!inventoryItem) {
                continue;
            }

            if (!inventoryItem.data) {
                continue;
            }

            if (!inventoryItem.data.hash) {
                continue;
            }

            if (!isFlagEnabled(inventoryItem.behavior, ItemType.IS_WEAPON)) {
                continue;
            }

            return inventoryItem as Item;
        }
    }

    for (let i = 0; i < player.data.toolbar.length; i++) {
        const item = player.data.toolbar[i];
        if (!item) {
            continue;
        }

        if (!item.data) {
            continue;
        }

        if (!item.data.hash) {
            continue;
        }

        if (!isFlagEnabled(item.behavior, ItemType.IS_WEAPON)) {
            continue;
        }

        return item as Item;
    }

    return null;
}

/**
 * Get an inventory item based on tab and slot.
 * @param {number} tab
 * @param {number} index
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */

function getInventoryItem(p: alt.Player, slot: number, tab: number): Item | null {
    if (tab >= 6) {
        return null;
    }

    if (slot >= 28) {
        return null;
    }

    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(p.data.inventory[tab][index]);
}

/**
 * Replaces an existing item with an updated version of itself.
 * Uses the same item slot.
 * @param {alt.Player} p
 * @param {Item} item
 * @param {number} tab
 * @return {*}  {boolean}
 */
function replaceInventoryItem(p: alt.Player, item: Item, tab: number): boolean {
    const itemIndex = p.data.inventory[tab].findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex <= -1) {
        return false;
    }

    p.data.inventory[tab][itemIndex] = item;
    return true;
}

/**
 * Get an equipment item based on slot.
 * @param {number} slot
 * @return {*}  {(Item | null)}
 * @memberof InventoryPrototype
 */
function getEquipmentItem(p: alt.Player, slot: number): Item | null {
    if (slot >= 11) {
        return null;
    }

    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(p.data.equipment[index]);
}

/**
 * Get a toolbar item based on slot.
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function getToolbarItem(p: alt.Player, slot: number): Item | null {
    if (slot >= 4) {
        return null;
    }

    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(p.data.toolbar[index]);
}

/**
 * Checks if an item is in the inventory data section.
 * Returns the tab in the inventory where it is.
 * Returns the index in the array of where this item is.
 * @param {InventoryType} type
 * @param {string} uuid
 * @return {boolean}  {Promise<void>}
 * @memberof InventoryPrototype
 */
function isInInventory(p: alt.Player, item: Partial<Item>): { tab: number; index: number } | null {
    for (let t = 0; t < p.data.inventory.length; t++) {
        const tab = p.data.inventory[t];

        if (tab.length <= 0) {
            continue;
        }

        for (let i = 0; i < tab.length; i++) {
            const inventoryItem = tab[i];
            if (!item) {
                continue;
            }

            const objectKeys = Object.keys(item);
            const keyIndex = objectKeys.findIndex((key) => item[key] === inventoryItem[key]);

            if (keyIndex <= -1) {
                continue;
            }

            return { tab: t, index: i };
        }
    }

    return null;
}
/**
 * Checks if an item is in the equipment data section.
 * Returns the index in the array of where this item is.
 * @param {Partial<Item>} item
 * @return {*}  {({ index: number } | null)}
 * @memberof InventoryPrototype
 */
function isInEquipment(p: alt.Player, item: Partial<Item>): { index: number } | null {
    if (p.data.equipment.length <= 0) {
        return null;
    }

    if (!item) {
        throw new Error(`[Athena] Specified item is null for isInEquipment`);
    }

    for (let i = 0; i < p.data.equipment.length; i++) {
        const equipmentItem = p.data.equipment[i];

        if (!equipmentItem) {
            continue;
        }

        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === equipmentItem[key]);

        if (keyIndex <= -1) {
            continue;
        }

        return { index: i };
    }

    return null;
}

/**
 * Check if an equipment slot is free.
 * @param {EquipmentType} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function isEquipmentSlotFree(p: alt.Player, slot: EquipmentType): boolean {
    if (slot >= 11) {
        return false;
    }

    if (p.data.equipment.length <= 0) {
        return true;
    }

    return p.data.equipment.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

/**
 * Check if the inventory slot is free.
 * @param {number} tab
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function isInventorySlotFree(p: alt.Player, slot: number, tab: number): boolean {
    if (tab >= 6) {
        return false;
    }

    if (slot >= 28) {
        return false;
    }

    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return true;
    }

    return false;
}

/**
 * Add an item to this player's inventory.
 * If the tab & slot are not empty it will return false.
 * @param {Item} item
 * @param {number} tab
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function inventoryAdd(p: alt.Player, item: Item, slot: number, tab: number): boolean {
    if (tab >= 6) {
        return false;
    }

    if (slot >= 28) {
        return false;
    }

    if (!p.data.inventory[tab]) {
        return false;
    }

    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);

    if (index >= 0) {
        return false;
    }

    if (item.slot !== slot) {
        item.slot = slot;
    }

    const safeItemCopy = deepCloneObject(item);
    p.data.inventory[tab].push(safeItemCopy);
    return true;
}

/**
 * Remove an item from this player's inventory.
 * Returns if the item is successfully removed from the slot.
 * @param {number} tab
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function inventoryRemove(p: alt.Player, slot: number, tab: number): boolean {
    if (slot >= 28) {
        return false;
    }

    if (tab >= 6) {
        return false;
    }

    if (!p.data.inventory[tab]) {
        return false;
    }

    const index = p.data.inventory[tab].findIndex((item) => item.slot === slot);

    if (index <= -1) {
        return false;
    }

    p.data.inventory[tab].splice(index, 1);
    return true;
}

/**
 * Remove an item from equipment base don slot.
 * @param {EquipmentType} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function equipmentRemove(p: alt.Player, slot: EquipmentType): boolean {
    if (slot >= 11) {
        return false;
    }

    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    p.data.equipment.splice(index, 1);
    return true;
}

function isEquipmentSlotValid(item: Item, slot: EquipmentType) {
    if (slot >= 11) {
        return false;
    }

    if (item.equipment === null || item.equipment !== slot) {
        return false;
    }

    return true;
}

/**
 * Sets an item into the equipment section of this inventory.
 * @param {Item} item
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function equipmentAdd(p: alt.Player, item: Item, slot: EquipmentType): boolean {
    if (slot >= 11) {
        return false;
    }

    if (!isEquipmentSlotFree(p, slot)) {
        return false;
    }

    // Prevent from adding equipment to wrong section.
    if (item.equipment !== slot) {
        return false;
    }

    // Update slot to match where it needs to go.
    if (item.slot !== slot) {
        item.slot = slot;
    }

    const safeItemCopy = deepCloneObject(item);
    p.data.equipment.push(safeItemCopy);
    return true;
}

/**
 * Check if a slot in the toolbar is free.
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function isToolbarSlotFree(p: alt.Player, slot: number): boolean {
    if (slot >= 4) {
        return false;
    }

    if (p.data.toolbar.length >= 4) {
        return false;
    }

    return p.data.toolbar.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

/**
 * Sets an item into the toolbar section of this player.
 * Returns true if it was successfully set.
 * @param {Item} item
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function toolbarAdd(p: alt.Player, item: Item, slot: number): boolean {
    if (slot >= 4) {
        return false;
    }

    if (!isToolbarSlotFree(p, slot)) {
        return false;
    }

    // Update slot to match where it needs to go.
    if (item.slot !== slot) {
        item.slot = slot;
    }

    const safeItemCopy = deepCloneObject(item);
    p.data.toolbar.push(safeItemCopy);
    return true;
}

/**
 * Removes an item from this player's toolbar.
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function toolbarRemove(p: alt.Player, slot: number): boolean {
    if (slot >= 4) {
        return false;
    }

    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    p.data.toolbar.splice(index, 1);
    return true;
}

/**
 * Replaces an existing item with an updated version of itself.
 * Uses the same item slot.
 * @param {alt.Player} p
 * @param {Item} item
 * @param {number} tab
 * @return {*}  {boolean}
 */
function replaceToolbarItem(p: alt.Player, item: Item): boolean {
    const itemIndex = p.data.toolbar.findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex <= -1) {
        return false;
    }

    p.data.toolbar[itemIndex] = item;
    return true;
}

/**
 * Checks if an item is in the toolbar data section.
 * Returns the index of the toolbar if it's present.
 * Returns null if the slot is empty.
 * @param {Partial<Item>} item
 * @return {*}  {({ index: number } | null)}
 * @memberof InventoryPrototype
 */
function isInToolbar(p: alt.Player, item: Partial<Item>): { index: number } | null {
    if (p.data.toolbar.length <= 0) {
        return null;
    }

    if (!item) {
        throw new Error(`[Athena] Specified item is null for isInToolbar`);
    }

    for (let i = 0; i < p.data.toolbar.length; i++) {
        const toolbarItem = p.data.toolbar[i];

        if (!toolbarItem) {
            continue;
        }

        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === toolbarItem[key]);

        if (keyIndex <= -1) {
            continue;
        }

        return { index: i };
    }

    return null;
}

/**
 * Removes an item from the player.
 * Returns true if the item was removed successfully.
 * Automatically saves inventory or toolbar on removal.
 * @param {alt.Player} player
 * @param {string} itemName This is CaSeSeNsItIvE
 * @return {*}  {boolean}
 */
function findAndRemove(player: alt.Player, itemName: string): boolean {
    // Check Toolbar First
    const toolbarItem = isInToolbar(player, { name: itemName });
    if (toolbarItem) {
        const item = player.data.toolbar[toolbarItem.index];
        if (!item) {
            return false;
        }

        const removedFromToolbar = toolbarRemove(player, item.slot);
        if (!removedFromToolbar) {
            return false;
        }

        save.field(player, 'toolbar', player.data.toolbar);
        sync.inventory(player);
        return true;
    }

    // Check Inventory Last
    const inventoryItem = isInInventory(player, { name: itemName });
    if (!inventoryItem) {
        return false;
    }

    const item = player.data.inventory[inventoryItem.tab][inventoryItem.index];
    if (!item) {
        return false;
    }

    const removedFromInventory = inventoryRemove(player, item.slot, inventoryItem.tab);
    if (!removedFromInventory) {
        return false;
    }

    save.field(player, 'inventory', player.data.inventory);
    sync.inventory(player);
    return true;
}

export default {
    equipmentAdd,
    equipmentRemove,
    findAndRemove,
    getEquipmentItem,
    getFreeInventorySlot,
    getInventoryItem,
    getToolbarItem,
    hasItem,
    hasWeapon,
    inventoryAdd,
    inventoryRemove,
    isEquipmentSlotValid,
    isEquipmentSlotFree,
    isInEquipment,
    isInInventory,
    isInToolbar,
    isInventorySlotFree,
    isToolbarSlotFree,
    replaceInventoryItem,
    replaceToolbarItem,
    toolbarAdd,
    toolbarRemove
};

import('../../views/inventory').catch((err) => {
    throw err;
});

if (process.env.TEST) {
    import('../../zTests/inventory')
        .catch((err) => {
            throw err;
        })
        .then((res) => res.default());
}
