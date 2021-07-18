import * as alt from 'alt-server';

import { EQUIPMENT_TYPE } from '../../../shared/enums/equipmentTypes';
import { INVENTORY_TYPE } from '../../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../../shared/enums/itemTypes';
import { Item, ItemSpecial } from '../../../shared/interfaces/Item';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { CategoryData } from '../../interface/CategoryData';
import { stripCategory } from '../../utility/category';
import emit from './emit';
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
        for (let x = 0; x < 27; x++) {
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
    if (hasInToolbar) {
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

            if (!isFlagEnabled(inventoryItem.behavior, ITEM_TYPE.IS_WEAPON)) {
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

        if (!isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON)) {
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
 * @param {INVENTORY_TYPE} type
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
 * @param {EQUIPMENT_TYPE} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function isEquipmentSlotFree(p: alt.Player, slot: EQUIPMENT_TYPE): boolean {
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
 * @param {EQUIPMENT_TYPE} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function equipmentRemove(p: alt.Player, slot: EQUIPMENT_TYPE): boolean {
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

/**
 * Checks if the equipment slot the item is going to is correct.
 * @param {Item} item
 * @param {EQUIPMENT_TYPE} slot Is the 'item.slot' the item will go to.
 * @return {*}
 */
function isEquipmentSlotValid(item: Item, slot: EQUIPMENT_TYPE) {
    if (slot >= 11) {
        return false;
    }

    if (item.equipment === null || item.equipment === undefined) {
        return false;
    }

    if (item.equipment !== slot) {
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
function equipmentAdd(p: alt.Player, item: Item, slot: EQUIPMENT_TYPE): boolean {
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

function findItemBySlot(
    player: alt.Player,
    selectedSlot: string,
    tab: number | null
): { item: Item; index: number } | null {
    // Inventory
    if (selectedSlot.includes('i')) {
        const item = getInventoryItem(player, stripCategory(selectedSlot), tab);
        if (!item) {
            return null;
        }

        return {
            item: deepCloneObject(item),
            index: player.data.inventory[tab].findIndex((i) => i.slot === item.slot)
        };
    }

    // Equipment
    if (selectedSlot.includes('e')) {
        const item = getEquipmentItem(player, stripCategory(selectedSlot));
        if (!item) {
            return null;
        }

        return { item: deepCloneObject(item), index: player.data.equipment.findIndex((i) => i.slot === item.slot) };
    }

    // Toolbar
    if (selectedSlot.includes('t')) {
        const item = getToolbarItem(player, stripCategory(selectedSlot));
        if (!item) {
            return null;
        }

        return { item: deepCloneObject(item), index: player.data.toolbar.findIndex((i) => i.slot === item.slot) };
    }

    return null;
}

function getSlotType(slot: string): string {
    if (slot.includes('i')) {
        return 'inventory';
    }

    if (slot.includes('tab')) {
        return 'tab';
    }

    if (slot.includes('t')) {
        return 'toolbar';
    }

    if (slot.includes('g')) {
        return 'ground';
    }

    if (slot.includes('e')) {
        return 'equipment';
    }

    return null;
}

function saveFields(player: alt.Player, fields: string[]): void {
    for (let i = 0; i < fields.length; i++) {
        save.field(player, fields[i], player.data[fields[i]]);
    }

    sync.inventory(player);
}

/**
 * Stacks or swaps items based on type, stackability, etc.
 * @param {alt.Player} player
 * @param {string} selectedSlot
 * @param {string} endSlot
 * @param {(number | null)} tab
 * @return {*}
 */
function handleSwapOrStack(
    player: alt.Player,
    selectedSlot: string,
    endSlot: string,
    tab: number | null,
    customItemRules: Array<Function>
) {
    const fieldsToSave = [];
    const selectItem = findItemBySlot(player, selectedSlot, tab);
    const endItem = findItemBySlot(player, endSlot, tab);

    if (!endItem || !selectItem) {
        console.log(`No end slot for this item... ${selectedSlot} to ${endSlot} at ${tab} (may be null)`);
        sync.inventory(player);
        return;
    }

    // Retain the last slots of these items.
    const newSelectSlot = endItem.item.slot;
    const newEndSlot = selectItem.item.slot;

    // Retain the index positions of the items.
    const selectIndex = selectItem.index;
    const endIndex = endItem.index;

    // Get Slot Names & Verify Valid Slots
    const selectedSlotName = getSlotType(selectedSlot);
    const endSlotName = getSlotType(endSlot);

    fieldsToSave.push(selectedSlotName);
    fieldsToSave.push(endSlotName);

    if (fieldsToSave.includes(null)) {
        sync.inventory(player);
        return;
    }

    const isSelectInventory = selectedSlotName.includes('inventory');
    const isEndInventory = endSlotName.includes('inventory');

    const isSelectEquipment = isFlagEnabled(selectItem.item.behavior, ITEM_TYPE.IS_EQUIPMENT);
    const isEndEquipment = isFlagEnabled(endItem.item.behavior, ITEM_TYPE.IS_EQUIPMENT);

    // Check if equipment types are compatible...
    if (isSelectEquipment || isEndEquipment) {
        if (endItem.item.equipment !== selectItem.item.equipment) {
            sync.inventory(player);
            return;
        }
    }

    const selectedArray: Array<Item> = isSelectInventory
        ? player.data[selectedSlotName][tab]
        : player.data[selectedSlotName];
    let endArray;

    if (selectedSlotName === endSlotName) {
        endArray = selectedArray;
    } else {
        endArray = isEndInventory ? player.data[endSlotName][tab] : player.data[endSlotName];
    }

    // Do Not Stack. Swap Instead.
    if (selectItem.item.name !== endItem.item.name) {
        // Need to verify that each slot follows the rules for the slot it is going into.
        if (!allItemRulesValid(player, selectItem.item, { name: endSlotName }, newEndSlot, customItemRules, tab)) {
            sync.inventory(player);
            return;
        }

        if (!allItemRulesValid(player, endItem.item, { name: selectedSlotName }, newSelectSlot, customItemRules, tab)) {
            sync.inventory(player);
            return;
        }

        // Swap the items between the two data sets.
        selectedArray[selectIndex] = endItem.item;
        selectedArray[selectIndex].slot = newEndSlot;

        endArray[endIndex] = selectItem.item;
        endArray[endIndex].slot = newSelectSlot;
    } else {
        // Handle Stacking
        const isSelectStackable = isFlagEnabled(selectItem.item.behavior, ITEM_TYPE.CAN_STACK);
        const isEndStackable = isFlagEnabled(endItem.item.behavior, ITEM_TYPE.CAN_STACK);

        // Handle Stacking
        if (!isSelectStackable || !isEndStackable) {
            sync.inventory(player);
            return;
        }

        // Add Selected Item to the Dropped on Item
        endArray[endIndex].quantity += selectItem.item.quantity;
        selectedArray.splice(selectIndex, 1);
    }

    // Determine which slot we are saving and if they are the same slot or not.
    // Assign the data to the player. Not turning back here.
    if (selectedSlotName !== endSlotName) {
        if (isSelectInventory) {
            player.data[selectedSlotName][tab] = selectedArray;
        } else {
            player.data[selectedSlotName] = selectedArray;
        }

        if (isEndInventory) {
            player.data[endSlotName][tab] = endArray;
        } else {
            player.data[endSlotName] = endArray;
        }
    } else {
        if (isSelectInventory) {
            player.data[selectedSlotName][tab] = selectedArray;
        } else {
            player.data[selectedSlotName] = selectedArray;
        }

        fieldsToSave.pop();
        emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    saveFields(player, fieldsToSave);
    sync.inventory(player);
}

/**
 * Checks rules for all items being moved in inventory.
 * @static
 * @param {Item} item
 * @param {CategoryData} endSlot
 * @param {number} endSlotIndex
 * @return {*}  {boolean}
 */
function allItemRulesValid(
    player: alt.Player,
    item: Item,
    endSlot: CategoryData,
    endSlotIndex: number | null,
    customItemRules: Array<Function>,
    tab: number | null
): boolean {
    if (!item.behavior) {
        return true;
    }

    if (endSlot) {
        // Not droppable but trying to drop on ground.
        if (!isFlagEnabled(item.behavior, ITEM_TYPE.CAN_DROP) && endSlot.name === INVENTORY_TYPE.GROUND) {
            return false;
        }

        // Not equipment but going into equipment.
        if (!isFlagEnabled(item.behavior, ITEM_TYPE.IS_EQUIPMENT) && endSlot.name === INVENTORY_TYPE.EQUIPMENT) {
            return false;
        }

        // Not a toolbar item but going into toolbar.
        if (!isFlagEnabled(item.behavior, ITEM_TYPE.IS_TOOLBAR) && endSlot.name === INVENTORY_TYPE.TOOLBAR) {
            return false;
        }

        // Is equipment and is going into an equipment slot.
        if (isFlagEnabled(item.behavior, ITEM_TYPE.IS_EQUIPMENT) && endSlot.name === INVENTORY_TYPE.EQUIPMENT) {
            if (!isEquipmentSlotValid(item, endSlotIndex)) {
                return false;
            }
        }
    }

    if (customItemRules.length >= 1) {
        for (let i = 0; i < customItemRules.length; i++) {
            if (!customItemRules[i](player, item, endSlot ? endSlot.name : null, endSlotIndex, tab)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Returns an array of all items in inventory, equipment, etc. as a single list.
 * @param {alt.Player} player
 * @return {*}  {Array<Item>}
 */
function getAllItems(player: alt.Player): Array<ItemSpecial> {
    let items = [];

    for (let i = 0; i < player.data.equipment.length; i++) {
        const item = deepCloneObject(player.data.equipment[i]) as ItemSpecial;
        item.dataIndex = i;
        item.dataName = 'equipment';
        item.isEquipment = true;
        items.push(item);
    }

    for (let i = 0; i < player.data.toolbar.length; i++) {
        const item = deepCloneObject(player.data.toolbar[i]) as ItemSpecial;
        item.dataIndex = i;
        item.dataName = 'toolbar';
        item.isToolbar = true;
        items.push(item);
    }

    player.data.inventory.forEach((tab, index) => {
        tab.forEach((originalItem, originalItemIndex) => {
            const item = deepCloneObject(originalItem) as ItemSpecial;
            item.dataIndex = originalItemIndex;
            item.dataName = 'inventory';
            item.isInventory = true;
            item.dataTab = index;
            items.push(item);
        });
    });

    return items;
}

/**
 * Stack an item in the player's inventory.
 * @param {alt.Player} player
 * @param {Item} item
 * @return {*}  {boolean}
 */
function stackInventoryItem(player: alt.Player, item: Item): boolean {
    const existingItem = isInInventory(player, item);

    if (!existingItem) {
        return false;
    }

    player.data.inventory[existingItem.tab][existingItem.index].quantity += item.quantity;
    save.field(player, 'inventory', player.data.inventory);
    sync.inventory(player);
    return true;
}

/**
 * Get a list of all weapons the player has on them.
 * @param {alt.Player} player
 * @return {*}  {Array<Item>}
 */
function getAllWeapons(player: alt.Player): Array<Item> {
    const weapons = getAllItems(player).filter((item) => {
        return isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON);
    });

    if (weapons.length <= 0) {
        return [];
    }

    return weapons;
}

/**
 * Removes all weapons from the player's inventory.
 * Returns the list of removed weapons.
 *
 * @param {alt.Player} player
 * @return {*}  {Array<Item>}
 */
function removeAllWeapons(player: alt.Player): Array<Item> {
    const weapons = getAllItems(player).filter((item) => {
        return isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON);
    });

    if (weapons.length <= 0) {
        return [];
    }

    const removedWeapons = [];

    // Work Backwards in Array
    // This prevents removing the wrong items.
    for (let i = weapons.length - 1; i >= 0; i--) {
        if (weapons[i].isInventory) {
            removedWeapons.push(player.data[weapons[i].dataName][weapons[i].dataTab].splice(weapons[i].dataIndex, 1));
            continue;
        }

        removedWeapons.push(player.data[weapons[i].dataName].splice(weapons[i].dataIndex, 1));
    }

    save.field(player, 'inventory', player.data.inventory);
    save.field(player, 'toolbar', player.data.toolbar);
    sync.inventory(player);
    player.removeAllWeapons();
    return removedWeapons;
}

export default {
    allItemRulesValid,
    equipmentAdd,
    equipmentRemove,
    findAndRemove,
    getAllItems,
    getAllWeapons,
    getEquipmentItem,
    getFreeInventorySlot,
    getInventoryItem,
    getSlotType,
    getToolbarItem,
    handleSwapOrStack,
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
    removeAllWeapons,
    replaceInventoryItem,
    replaceToolbarItem,
    stackInventoryItem,
    toolbarAdd,
    toolbarRemove
};
