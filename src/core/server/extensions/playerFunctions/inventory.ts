import * as alt from 'alt-server';
import { EQUIPMENT_TYPE } from '../../../shared/enums/equipmentType';
import { INVENTORY_TYPE } from '../../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../../shared/enums/itemTypes';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Item, ItemSpecial } from '../../../shared/interfaces/item';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { CategoryData } from '../../interface/iCategoryData';
import { stripCategory } from '../../utility/category';
import { ItemFactory } from '../../systems/item';
import { Athena } from '../../api/athena';

const MAX_EQUIPMENT_SLOTS = 12; // This really should not be changed. Ever.
const TEMP_MAX_TOOLBAR_SIZE = 4;
const TEMP_MAX_INVENTORY_SLOTS = 28;

/**
 * Converts an inventory from 2.0.2 to 3.0.0 inventory style.
 * Which is a single Array of items.
 * @param {alt.Player} player
 * @return {*}
 */
async function convert(player: alt.Player): Promise<void> {
    if (!player.data) {
        return;
    }

    if (!player.data.inventory) {
        return;
    }

    // Not a legacy inventory system. Ignoring.
    if (Array.isArray(player.data.inventory) && !Array.isArray(player.data.inventory[0])) {
        return;
    }

    const inventory = player.data.inventory as Array<Array<Partial<Item>>>;
    const playerItems: Array<Partial<Item>> = [];
    let currentSlot = 0;

    for (let x = 0; x < inventory.length; x++) {
        for (let y = 0; y < inventory[x].length; y++) {
            const item = inventory[x][y];
            item.slot = currentSlot;
            playerItems.push(item);
            currentSlot += 1;
        }
    }

    player.data.inventory = playerItems;
    await Athena.player.save.field(player, 'inventory', player.data.inventory);
}

/**
 * Adds an item to the equipment tab.
 * @param {alt.Player} player
 * @param {Item} item
 * @param {EQUIPMENT_TYPE} slot
 * @return {boolean}
 */
function equipmentAdd(player: alt.Player, item: Item, slot: EQUIPMENT_TYPE): boolean {
    if (slot >= MAX_EQUIPMENT_SLOTS) {
        return false;
    }

    if (!isEquipmentSlotFree(player, slot)) {
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
    player.data.equipment.push(safeItemCopy);
    return true;
}

/**
 * Check if an equipment slot is free.
 * @param {alt.Player} player
 * @param {EQUIPMENT_TYPE} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function isEquipmentSlotFree(player: alt.Player, slot: EQUIPMENT_TYPE): boolean {
    if (slot >= MAX_EQUIPMENT_SLOTS) {
        return false;
    }

    if (player.data.equipment.length <= 0) {
        return true;
    }

    return player.data.equipment.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

/**
 * Returns an array of all items in inventory, equipment, etc. as a single list.
 * @param {alt.Player} player
 * @return {Array<Item>}
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

    for (let i = 0; i < player.data.inventory.length; i++) {
        const item = deepCloneObject(player.data.inventory[i]) as ItemSpecial;
        item.dataIndex = i;
        item.dataName = 'inventory';
        item.isInventory = true;
        items.push(item);
    }

    return items;
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
 * Get an equipment item based on slot.
 * @param {number} slot
 * @return {*}  {(Item | null)}
 * @memberof InventoryPrototype
 */
function getEquipmentItem(player: alt.Player, slot: number): Item | null {
    if (slot >= MAX_EQUIPMENT_SLOTS) {
        return null;
    }

    const index = player.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(player.data.equipment[index]);
}

function getSlotType(slot: string): string {
    if (slot.includes('i')) {
        return 'inventory';
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

/**
 * Get a toolbar item based on slot.
 * @param {number} slot
 * @return {*}  {boolean}
 * @memberof InventoryPrototype
 */
function getToolbarItem(player: alt.Player, slot: number): Item | null {
    if (slot >= TEMP_MAX_TOOLBAR_SIZE) {
        return null;
    }

    const index = player.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(player.data.toolbar[index]);
}

/**
 * Checks if an item is in the inventory data section.
 * Returns the tab in the inventory where it is.
 * Returns the index in the array of where this item is.
 * @param {INVENTORY_TYPE} type
 * @param {string} uuid
 * @return { { index: number}  | null }
 * @memberof InventoryPrototype
 */
function isInInventory(player: alt.Player, item: Partial<Item>): { index: number } | null {
    for (let i = 0; i < player.data.inventory.length; i++) {
        const inventoryItem = player.data.inventory[i];
        if (!item) {
            continue;
        }

        const objectKeys = Object.keys(item);
        const keyIndex = objectKeys.findIndex((key) => item[key] === inventoryItem[key]);

        if (keyIndex <= -1) {
            continue;
        }

        return { index: i };
    }

    return null;
}

/**
 * Checks if an item is in the equipment data section.
 * Returns the index in the array of where this item is.
 * @param {Partial<Item>} item
 * @return { { index: number } | null }
 * @memberof InventoryPrototype
 */
function isInEquipment(player: alt.Player, item: Partial<Item>): { index: number } | null {
    if (player.data.equipment.length <= 0) {
        return null;
    }

    if (!item) {
        throw new Error(`[Athena] Specified item is null for isInEquipment`);
    }

    for (let i = 0; i < player.data.equipment.length; i++) {
        const equipmentItem = player.data.equipment[i];

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
 * Check if the inventory slot is free.
 * @param {alt.Player} player
 * @param {number} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function isInventorySlotFree(player: alt.Player, slot: number): boolean {
    if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
        return false;
    }

    const index = player.data.inventory.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return true;
    }

    return false;
}

/**
 * Check if a slot in the toolbar is free.
 * @param {number} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function isToolbarSlotFree(player: alt.Player, slot: number): boolean {
    if (slot >= TEMP_MAX_TOOLBAR_SIZE) {
        return false;
    }

    if (player.data.toolbar.length >= TEMP_MAX_TOOLBAR_SIZE) {
        return false;
    }

    return player.data.toolbar.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

/**
 * Sets an item into the toolbar section of this player.
 * Returns true if it was successfully set.
 * @param {Item} item
 * @param {number} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function toolbarAdd(player: alt.Player, item: Item, slot: number): boolean {
    if (slot >= TEMP_MAX_TOOLBAR_SIZE) {
        return false;
    }

    if (!isToolbarSlotFree(player, slot)) {
        return false;
    }

    // Update slot to match where it needs to go.
    if (item.slot !== slot) {
        item.slot = slot;
    }

    const safeItemCopy = deepCloneObject(item);
    player.data.toolbar.push(safeItemCopy);
    return true;
}

/**
 * Removes an item from this player's toolbar.
 * @param {alt.Player} player
 * @param {number} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function toolbarRemove(player: alt.Player, slot: number): boolean {
    const index = player.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    player.data.toolbar.splice(index, 1);
    return true;
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
 * Checks if an item is in the toolbar data section.
 * Returns the index of the toolbar if it's present.
 * Returns null if the slot is empty.
 * @param {alt.Player} player
 * @param {Partial<Item>} item
 * @return {{ index: number } | null}
 * @memberof InventoryPrototype
 */
function isInToolbar(player: alt.Player, item: Partial<Item>): { index: number } | null {
    if (player.data.toolbar.length <= 0) {
        return null;
    }

    if (!item) {
        throw new Error(`[Athena] Specified item is null for isInToolbar`);
    }

    for (let i = 0; i < player.data.toolbar.length; i++) {
        const toolbarItem = player.data.toolbar[i];

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
 * Removes all weapons from the player's inventory.
 * Returns the list of removed weapons.
 * @param {alt.Player} player
 * @return {Array<Item>}
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
            removedWeapons.push(player.data[weapons[i].dataName].splice(weapons[i].dataIndex, 1));
            continue;
        }

        removedWeapons.push(player.data[weapons[i].dataName].splice(weapons[i].dataIndex, 1));
    }

    Athena.player.save.field(player, 'inventory', player.data.inventory);
    Athena.player.save.field(player, 'toolbar', player.data.toolbar);
    Athena.player.sync.inventory(player);
    player.removeAllWeapons();
    return removedWeapons;
}

/**
 * Check if the player has a weapon.
 * Returns the item if they do.
 * @param {alt.Player} player
 * @return {(Item | null)}
 */
function hasWeapon(player: alt.Player): Item | null {
    for (let i = 0; i < player.data.inventory.length; i++) {
        const inventoryItem = player.data.inventory[i];
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
 * Remove an item from equipment base don slot.
 * Does not save after removing item.
 * @param {EQUIPMENT_TYPE} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function equipmentRemove(player: alt.Player, slot: EQUIPMENT_TYPE): boolean {
    if (slot >= MAX_EQUIPMENT_SLOTS) {
        return false;
    }

    const index = player.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    player.data.equipment.splice(index, 1);
    return true;
}

/**
 * Removes an item from the player.
 * Returns true if the item was removed successfully.
 * Automatically saves inventory or toolbar on removal.
 * @param {alt.Player} player
 * @param {string} itemName This is CaSeSeNsItIvE
 * @return {boolean}
 */
function findAndRemove(player: alt.Player, itemName: string): boolean {
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

        Athena.player.save.field(player, 'toolbar', player.data.toolbar);
        Athena.player.sync.inventory(player);
        return true;
    }

    // Check Inventory Last
    const inventoryItem = isInInventory(player, { name: itemName });
    if (!inventoryItem) {
        return false;
    }

    const item = player.data.inventory[inventoryItem.index];
    if (!item) {
        return false;
    }

    const removedFromInventory = inventoryRemove(player, item.slot);
    if (!removedFromInventory) {
        return false;
    }

    Athena.player.save.field(player, 'inventory', player.data.inventory);
    Athena.player.sync.inventory(player);
    return true;
}

/**
 * Remove an item from this player's inventory.
 * Does not save after removing the item.
 * Returns if the item is successfully removed from the slot.
 * @param {alt.Player} player
 * @param {number} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function inventoryRemove(player: alt.Player, slot: number): boolean {
    if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
        return false;
    }

    const index = player.data.inventory.findIndex((item) => item.slot === slot);

    if (index <= -1) {
        return false;
    }

    player.data.inventory.splice(index, 1);
    return true;
}

/**
 * Add an item to this player's inventory.
 * If the tab & slot are not empty it will return false.
 * @param {alt.Player} player
 * @param {Item} item
 * @param {number} slot
 * @return {boolean}
 * @memberof InventoryPrototype
 */
function inventoryAdd(player: alt.Player, item: Item, slot: number): boolean {
    if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
        return false;
    }

    const index = player.data.inventory.findIndex((item) => item.slot === slot);

    if (index >= 0) {
        return false;
    }

    if (item.slot !== slot) {
        item.slot = slot;
    }

    const safeItemCopy = deepCloneObject(item);
    player.data.inventory.push(safeItemCopy);
    return true;
}

/**
 * Stacks or swaps items based on type, stackability, etc.
 * @param {alt.Player} player
 * @param {string} selectedSlot
 * @param {string} endSlot
 * @return {*}
 */
function handleSwapOrStack(player: alt.Player, selectedSlot: string, endSlot: string) {
    const fieldsToSave = [];
    const selectItem = findItemBySlot(player, selectedSlot);
    const endItem = findItemBySlot(player, endSlot);

    if (!endItem || !selectItem) {
        console.log(`No end slot for this item... ${selectedSlot} to ${endSlot} (may be null)`);
        Athena.player.sync.inventory(player);
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
        Athena.player.sync.inventory(player);
        return;
    }

    const isSelectEquipment = isFlagEnabled(selectItem.item.behavior, ITEM_TYPE.IS_EQUIPMENT);
    const isEndEquipment = isFlagEnabled(endItem.item.behavior, ITEM_TYPE.IS_EQUIPMENT);

    // Check if equipment types are compatible...
    if (isSelectEquipment || isEndEquipment) {
        if (endItem.item.equipment !== selectItem.item.equipment) {
            Athena.player.sync.inventory(player);
            return;
        }
    }

    const selectedArray: Array<Item> = player.data[selectedSlotName];
    const endArray: Array<Item> = selectedSlotName === endSlotName ? selectedArray : player.data[endSlotName];

    // Do Not Stack. Swap Instead.
    if (selectItem.item.name !== endItem.item.name || selectItem.item.rarity !== selectItem.item.rarity) {
        // Need to verify that each slot follows the rules for the slot it is going into.
        // Handles rules for the end item slot.
        if (!allItemRulesValid(selectItem.item, { name: endSlotName }, newEndSlot)) {
            Athena.player.sync.inventory(player);
            return;
        }

        // Handles rules for the selected item slot.
        if (!allItemRulesValid(endItem.item, { name: selectedSlotName }, newSelectSlot)) {
            Athena.player.sync.inventory(player);
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
            Athena.player.sync.inventory(player);
            return;
        }

        const newValue = endArray[endIndex].quantity + selectItem.item.quantity;
        if (endArray[endIndex].maxStack && newValue > endArray[endIndex].maxStack) {
            Athena.player.sync.inventory(player);
            return;
        }

        // Add Selected Item to the Dropped on Item
        endArray[endIndex].quantity = newValue;
        selectedArray.splice(selectIndex, 1);
    }

    // Determine which slot we are saving and if they are the same slot or not.
    // Assign the data to the player. No turning back here.
    if (selectedSlotName !== endSlotName) {
        player.data[selectedSlotName] = selectedArray;
        player.data[endSlotName] = endArray;
    } else {
        player.data[selectedSlotName] = selectedArray;
        fieldsToSave.pop();
        Athena.player.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    saveFields(player, fieldsToSave);
    Athena.player.sync.inventory(player);
}

function saveFields(player: alt.Player, fields: string[]): void {
    for (let i = 0; i < fields.length; i++) {
        Athena.player.save.field(player, fields[i], player.data[fields[i]]);
    }

    Athena.player.sync.inventory(player);
}

/**
 * Checks rules for all items being moved in inventory.
 * @static
 * @param {Item} item
 * @param {CategoryData} endSlot
 * @param {number} endSlotIndex
 * @return {boolean}
 */
function allItemRulesValid(item: Item, endSlot: CategoryData, endSlotIndex: number | null): boolean {
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

    return true;
}

function findItemBySlot(player: alt.Player, selectedSlot: string): { item: Item; index: number } | null {
    // Inventory
    if (selectedSlot.includes('i')) {
        const item = getInventoryItem(player, stripCategory(selectedSlot));
        if (!item) {
            return null;
        }

        return {
            item: deepCloneObject(item),
            index: player.data.inventory.findIndex((i) => i.slot === item.slot),
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

/**
 * Get an inventory item based on slot.
 * @param { alt.Player } player
 * @param { number } slot
 * @return { Item | null }
 * @memberof InventoryPrototype
 */

function getInventoryItem(player: alt.Player, slot: number): Item | null {
    if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
        return null;
    }

    const index = player.data.inventory.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(player.data.inventory[index]);
}

/**
 * Scans the players inventory to try and find a key / value pair in the 'data' section.
 * Useful to find an arbitrary item with a key / value pair.
 *
 *
 * @param {alt.Player} player
 * @param {string} key
 * @param {*} value
 */
function checkForKeyValuePair(player: alt.Player, key: string, value: any) {
    const index = player.data.inventory.findIndex((item) => {
        if (!item.data) {
            return false;
        }

        if (typeof item.data !== 'object') {
            return false;
        }

        if (!item.data[key]) {
            return false;
        }

        if (item.data[key] !== value) {
            return false;
        }

        return true;
    });

    return index >= 0;
}

/**
 * Checks if the equipment slot the item is going to is correct.
 * @param {Item} item
 * @param {EQUIPMENT_TYPE} slot Is the 'item.slot' the item will go to.
 * @return {*}
 */
function isEquipmentSlotValid(item: Item, slot: EQUIPMENT_TYPE) {
    if (slot >= MAX_EQUIPMENT_SLOTS) {
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
 * Return the slot to use for adding an item.
 * @param { alt.Player } player
 * @return { { slot: number } }
 * @memberof InventoryPrototype
 */
function getFreeInventorySlot(player: alt.Player): { slot: number } | null {
    if (player.data.inventory.length >= TEMP_MAX_INVENTORY_SLOTS) {
        return null;
    }

    for (let i = 0; i <= TEMP_MAX_INVENTORY_SLOTS - 1; i++) {
        const itemIndex = player.data.inventory.findIndex((item) => item.slot === i);
        if (itemIndex >= 0) {
            continue;
        }

        return { slot: i };
    }

    return null;
}

/**
 * Return slots available in the player's inventory.
 * @param { alt.Player } player
 * @return { Array<{ slot: number }> }
 * @memberof InventoryPrototype
 */
function getFreeInventorySlots(player: alt.Player): Array<{ slot: number }> {
    let slots: Array<{ slot: number }> = [];

    if (player.data.inventory.length >= TEMP_MAX_INVENTORY_SLOTS) {
        return slots;
    }

    // x is the free slot to assign the item
    for (let x = 0; x <= TEMP_MAX_INVENTORY_SLOTS - 1; x++) {
        const itemIndex = player.data.inventory.findIndex((item) => item.slot === x);
        if (itemIndex >= 0) {
            continue;
        }

        slots.push({ slot: x });
    }

    return slots;
}

/**
 * Replaces an existing item with an updated version of itself.
 * Uses the same item slot.
 * Does not save.
 * @param {alt.Player} player
 * @param {Item} item
 * @return {*}  {boolean}
 */
function replaceInventoryItem(player: alt.Player, item: Item): boolean {
    const itemIndex = player.data.inventory.findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex <= -1) {
        return false;
    }

    player.data.inventory[itemIndex] = item;
    return true;
}

/**
 * Replaces an existing item with an updated version of itself.
 * Uses the same item slot.
 * Does not save.
 * @param {alt.Player} player
 * @param {Item} item
 * @return {boolean}
 */
function replaceToolbarItem(player: alt.Player, item: Item): boolean {
    const itemIndex = player.data.toolbar.findIndex((existingItem) => existingItem.slot === item.slot);
    if (itemIndex <= -1) {
        return false;
    }

    player.data.toolbar[itemIndex] = item;
    return true;
}

/**
 * Stack an item in the player's inventory.
 * @param {alt.Player} player
 * @param {Item} item
 * @return {boolean}
 */
function stackInventoryItem(player: alt.Player, item: Item): boolean {
    const existingItem = isInInventory(player, item);

    if (!existingItem) {
        return false;
    }

    if (item.rarity !== player.data.inventory[existingItem.index].rarity) {
        return false;
    }

    const newSize = player.data.inventory[existingItem.index].quantity + item.quantity;
    if (item.maxStack && newSize > item.maxStack) {
        return false;
    }

    player.data.inventory[existingItem.index].quantity += item.quantity;
    Athena.player.save.field(player, 'inventory', player.data.inventory);
    Athena.player.sync.inventory(player);
    return true;
}

/**
 * Used to send information to the in-game menu of the inventory if it is open.
 * @param {alt.Player} player
 * @param {string} info
 */
function notify(player: alt.Player, info: string) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_NOTIFICATION, info);
}

/**
 * Gets weight from the entire inventory.
 * Weight can be assigned to an item by putting 'weight' in data.
 * @param {alt.Player} player
 * @return {number}
 */
function getTotalWeight(player: alt.Player): number {
    const inventory = [...player.data.inventory];
    let total = 0;

    for (let i = 0; i < inventory.length; i++) {
        const item = inventory[i];
        if (!item) {
            continue;
        }

        if (!item.data) {
            continue;
        }

        if (!item.data.weight) {
            continue;
        }

        total += parseFloat(item.data.weight);
    }

    return total;
}

/**
 * Remove amount of item from this player's inventory by looking into slots and quantities
 * Does not save after removing the items.
 * Returns amount left if inventory hadn't enough to remove.
 * @param {alt.Player} player
 * @param {itemToRemove} item to Remove
 * @param {amount} amount to be removed from Inventory
 * @return {number}
 * @memberof InventoryPrototype
 */
async function removeAmountFromInventoryReturnRemainingAmount(
    player: alt.Player,
    itemDbName: string,
    amount: number,
): Promise<number> {
    const itemToRemove = await ItemFactory.get(itemDbName);
    let amountToBeRemoved = amount;
    for (let inventoryItem of player.data.inventory) {
        if (amountToBeRemoved > 0) {
            if (inventoryItem.dbName === itemToRemove.dbName && inventoryItem.rarity === itemToRemove.rarity) {
                //So how much is left on this stack?
                if (inventoryItem.quantity > amountToBeRemoved) {
                    //Everything we want to sell is here
                    inventoryItem.quantity -= amountToBeRemoved;
                    return 0;
                } else {
                    //We sell the whole item-stack
                    amountToBeRemoved -= inventoryItem.quantity;
                    inventoryRemove(player, inventoryItem.slot);
                }
            }
        }
    }
    return amountToBeRemoved;
}

/**
 * Adds or stacks amount of itemDbName to Inventory by item-quantity times.
 * Does not save after adding the items.
 * Returns amount left if inventory was full.
 *
 * TODO Deal with weight?!
 * @param {alt.Player} player
 * @param {itemToAdd} item to Add
 * @param {amount} amount to be added to Inventory
 * @return {number}
 * @memberof InventoryPrototype
 */
async function addAmountToInventoryReturnRemainingAmount(
    player: alt.Player,
    itemDbName: string,
    amount: number,
): Promise<number> {
    const itemToAdd = await ItemFactory.get(itemDbName);
    let itemsLeftToStoreInInventory = amount * itemToAdd.quantity;
    if (isFlagEnabled(itemToAdd.behavior, ITEM_TYPE.CAN_STACK)) {
        for (let inventoryItem of player.data.inventory) {
            if (itemsLeftToStoreInInventory >= itemToAdd.quantity) {
                if (
                    isFlagEnabled(inventoryItem.behavior, ITEM_TYPE.CAN_STACK) &&
                    inventoryItem.dbName === itemToAdd.dbName &&
                    inventoryItem.rarity === itemToAdd.rarity
                ) {
                    if (!inventoryItem.maxStack) {
                        //You can stack as much as you want. So go for it
                        inventoryItem.quantity += itemsLeftToStoreInInventory;
                        //Obvoiusly there is nothing left to be stored here:
                        return 0;
                    } else {
                        //So how much is left to stack?
                        let freeQuantity = inventoryItem.maxStack - inventoryItem.quantity;
                        if (freeQuantity >= itemsLeftToStoreInInventory) {
                            //Everything we buy fits on top of this stack
                            inventoryItem.quantity += itemsLeftToStoreInInventory;
                            return 0;
                        } else {
                            //We still have something left. So we fill this stack and move on
                            inventoryItem.quantity = inventoryItem.maxStack;
                            itemsLeftToStoreInInventory -= freeQuantity;
                        }
                    }
                }
            }
        }
    }
    if (itemsLeftToStoreInInventory > 0 && itemsLeftToStoreInInventory >= itemToAdd.quantity) {
        //Either there is something left or wasn't stackable. So go for the Empty-Slots
        const emptySlots = getFreeInventorySlots(player);
        for (let emptySlot of emptySlots) {
            if (itemsLeftToStoreInInventory >= itemToAdd.quantity) {
                let addableItem: Item = deepCloneObject(itemToAdd);
                if (isFlagEnabled(itemToAdd.behavior, ITEM_TYPE.CAN_STACK)) {
                    if (!itemToAdd.maxStack || itemToAdd.maxStack >= itemsLeftToStoreInInventory) {
                        //Everything fits into this stack. So go for it
                        addableItem.quantity = itemsLeftToStoreInInventory;
                        //Obvoiusly there is nothing left to be stored here:
                        itemsLeftToStoreInInventory = 0;
                    } else if (itemToAdd.maxStack) {
                        //We still have something left. So we fill this stack and move on
                        addableItem.quantity = itemToAdd.maxStack;
                        itemsLeftToStoreInInventory -= itemToAdd.maxStack;
                    }
                } else {
                    addableItem.quantity = itemsLeftToStoreInInventory--;
                }
                inventoryAdd(player, addableItem, emptySlot.slot);
            }
        }
    }
    if (itemsLeftToStoreInInventory > 0 && itemsLeftToStoreInInventory < itemToAdd.quantity) {
        //We have less then itemToAdd.quantity left when inventory was full, so
        return 1;
    } else {
        return itemsLeftToStoreInInventory / itemToAdd.quantity;
    }
}

/**
 * Used to override an existing Athena.player.inventory function.
 * Requires the same exact name of the function, and the parameters.
 *
 * @param {string} functionName
 * @param {(player: alt.Player, ...args: any[]) => void} callback
 */
function override(functionName: string, callback: (player: alt.Player, ...args: any[]) => void) {
    if (!exports[functionName]) {
        alt.logError(`Athena.player.inventory does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

const exports = {
    convert,
    allItemRulesValid,
    checkForKeyValuePair,
    equipmentAdd,
    equipmentRemove,
    findAndRemove,
    getAllItems,
    getAllWeapons,
    getEquipmentItem,
    getFreeInventorySlot,
    getFreeInventorySlots,
    getInventoryItem,
    getSlotType,
    getToolbarItem,
    getTotalWeight,
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
    notify,
    removeAllWeapons,
    replaceInventoryItem,
    replaceToolbarItem,
    stackInventoryItem,
    toolbarAdd,
    toolbarRemove,
    addAmountToInventoryReturnRemainingAmount,
    removeAmountFromInventoryReturnRemainingAmount,
    override,
};

export default exports;
