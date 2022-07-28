import * as alt from 'alt-server';
import { EQUIPMENT_TYPE } from '../../../shared/enums/equipmentType';
import { INVENTORY_TYPE } from '../../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../../shared/enums/itemTypes';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Item, ItemData, ItemSpecial } from '../../../shared/interfaces/item';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { CategoryData } from '../../interface/iCategoryData';
import { stripCategory } from '../../utility/category';
import { ItemFactory } from '../../systems/item';
import { Athena } from '../../api/athena';
import save from './save';
import sync from './sync';
import { ClothingComponent } from '../../../shared/interfaces/clothing';
import { Character } from '../../../shared/interfaces/character';
import { ReadOnlyPlayer } from './shared';

const MAX_EQUIPMENT_SLOTS = 12; // This really should not be changed. Ever.
const TEMP_MAX_TOOLBAR_SIZE = 4;
const TEMP_MAX_INVENTORY_SLOTS = 28;

type ItemGroup = keyof Pick<Character, 'equipment' | 'inventory' | 'toolbar'>;

const Inventory = {
    /**
     * Adds an item to the equipment tab.
     * @param {alt.Player} player
     * @param {Item} item
     * @param {EQUIPMENT_TYPE} slot
     * @return {boolean}
     */
    equipmentAdd(player: alt.Player, item: Item, slot: EQUIPMENT_TYPE): boolean {
        if (slot >= MAX_EQUIPMENT_SLOTS) {
            return false;
        }

        if (!Inventory.isEquipmentSlotFree(player, slot)) {
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

        const safeItemCopy = deepCloneObject<Item>(item);
        if (typeof player.data.equipment !== 'undefined') {
            player.data.equipment.push(safeItemCopy);
        } else {
            player.data.equipment = [safeItemCopy];
        }

        return true;
    },

    /**
     * Check if an equipment slot is free.
     * @param {alt.Player} player
     * @param {EQUIPMENT_TYPE} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    isEquipmentSlotFree(player: alt.Player, slot: EQUIPMENT_TYPE): boolean {
        if (slot >= MAX_EQUIPMENT_SLOTS) {
            return false;
        }

        if (typeof player.data.equipment === 'undefined' || player.data.equipment.length <= 0) {
            player.data.equipment = [];
            return true;
        }

        return player.data.equipment.findIndex((item) => item.slot === slot) === -1 ? true : false;
    },

    /**
     * Returns an array of all items in inventory, equipment, etc. as a single list.
     * @param {alt.Player} player
     * @return {Array<Item>}
     */
    getAllItems(player: alt.Player): Array<ItemSpecial> {
        let items = [];

        if (typeof player.data.equipment === 'undefined') {
            player.data.equipment = [];
        }

        if (typeof player.data.inventory === 'undefined') {
            player.data.inventory = [];
        }

        if (typeof player.data.toolbar === 'undefined') {
            player.data.toolbar = [];
        }

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
    },

    /**
     * Get a list of all weapons the player has on them.
     * @param {alt.Player} player
     * @return {*}  {Array<Item>}
     */
    getAllWeapons(player: alt.Player): Array<Item> {
        const weapons = Inventory.getAllItems(player).filter((item) => {
            return isFlagEnabled(item.behavior, ITEM_TYPE.IS_WEAPON);
        });

        if (weapons.length <= 0) {
            return [];
        }

        return weapons;
    },

    /**
     * Get an equipment item based on slot.
     * @param {number} slot
     * @return {*}  {(Item | null)}
     * @memberof InventoryPrototype
     */
    getEquipmentItem(player: alt.Player, slot: number): Item | null {
        return Inventory.getItemBySlot(player as Readonly<alt.Player>, slot, 'equipment');
    },

    getSlotType(slot: string): string | undefined {
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

        return undefined;
    },

    getItemBySlot(playerRef: alt.Player, slot: number, type: ItemGroup): Item | null {
        const player = playerRef as Readonly<alt.Player & { data: Character }>;

        if (typeof player.data[type] === 'undefined') {
            player.data[type] = [];
            return null;
        }

        const index = player.data[type].findIndex((item) => {
            if (item && item.slot === slot) {
                return true;
            }

            return false;
        });

        if (index <= -1) {
            return null;
        }

        return deepCloneObject<Item>(player.data[type][index]);
    },

    /**
     * Get a toolbar item based on slot.
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    getToolbarItem(player: alt.Player, slot: number): Item | null {
        if (slot >= TEMP_MAX_TOOLBAR_SIZE) {
            return null;
        }

        return Inventory.getItemBySlot(player, slot, 'toolbar');
    },

    isItemIn(playerRef: alt.Player, item: Partial<Item>, type: ItemGroup): { index: number } | null {
        const player = playerRef as ReadOnlyPlayer;
        if (typeof player.data[type] === 'undefined') {
            return null;
        }

        for (let i = 0; i < player.data[type].length; i++) {
            const inventoryItem = player.data.inventory[i];
            if (!item) {
                continue;
            }

            const objectKeys = Object.keys(item);
            const keyIndex = objectKeys.findIndex((key: string) => {
                if (item.hasOwnProperty(key) && item[key as keyof Item] === inventoryItem[key as keyof Item]) {
                    return true;
                }

                return false;
            });

            if (keyIndex <= -1) {
                continue;
            }

            return { index: i };
        }

        return null;
    },

    /**
     * Checks if an item is in the inventory data section.
     * Returns the tab in the inventory where it is.
     * Returns the index in the array of where this item is.
     * @param {INVENTORY_TYPE} type
     * @param {string} uuid
     * @return { { index: number}  | null }
     * @memberof InventoryPrototype
     */
    isInInventory(player: alt.Player, item: Partial<Item>): { index: number } | null {
        return Inventory.isItemIn(player, item, 'inventory');
    },

    /**
     * Checks if an item is in the equipment data section.
     * Returns the index in the array of where this item is.
     * @param {Partial<Item>} item
     * @return { { index: number } | null }
     * @memberof InventoryPrototype
     */
    isInEquipment(player: alt.Player, item: Partial<Item>): { index: number } | null {
        return Inventory.isItemIn(player, item, 'equipment');
    },

    /**
     * Check if the inventory slot is free.
     * @param {alt.Player} player
     * @param {number} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    isInventorySlotFree(playerRef: alt.Player, slot: number): boolean {
        const player = playerRef as ReadOnlyPlayer;
        if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
            return false;
        }

        const index = player.data.inventory.findIndex((item) => item.slot === slot);
        if (index <= -1) {
            return true;
        }

        return false;
    },

    /**
     * Check if a slot in the toolbar is free.
     * @param {number} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    isToolbarSlotFree(playerRef: alt.Player, slot: number): boolean {
        const player = playerRef as ReadOnlyPlayer;
        if (slot >= TEMP_MAX_TOOLBAR_SIZE) {
            return false;
        }

        if (player.data.toolbar.length >= TEMP_MAX_TOOLBAR_SIZE) {
            return false;
        }

        return player.data.toolbar.findIndex((item) => item.slot === slot) === -1 ? true : false;
    },

    /**
     * Sets an item into the toolbar section of this player.
     * Returns true if it was successfully set.
     * @param {Item} item
     * @param {number} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    toolbarAdd(playerRef: alt.Player, item: Item, slot: number): boolean {
        const player = playerRef as ReadOnlyPlayer;
        if (slot >= TEMP_MAX_TOOLBAR_SIZE) {
            return false;
        }

        if (!Inventory.isToolbarSlotFree(player, slot)) {
            return false;
        }

        // Update slot to match where it needs to go.
        if (item.slot !== slot) {
            item.slot = slot;
        }

        const safeItemCopy = deepCloneObject<Item>(item);
        player.data.toolbar.push(safeItemCopy);
        return true;
    },

    /**
     * Removes an item from this player's toolbar.
     * @param {alt.Player} player
     * @param {number} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    toolbarRemove(playerRef: alt.Player, slot: number): boolean {
        const player = playerRef as ReadOnlyPlayer;
        const index = player.data.toolbar.findIndex((item) => item.slot === slot);
        if (index <= -1) {
            return false;
        }

        player.data.toolbar.splice(index, 1);
        return true;
    },

    /**
     * If the player has an item type anywhere in their inventory.
     * @param {Partial<Item>} item
     */
    hasItem(player: alt.Player, item: Partial<Item>): boolean {
        let hasInInventory = Inventory.isInInventory(player, item);
        if (hasInInventory) {
            return true;
        }

        let hasInToolbar = Inventory.isInToolbar(player, item);
        if (hasInToolbar) {
            return true;
        }

        return false;
    },

    /**
     * Checks if an item is in the toolbar data section.
     * Returns the index of the toolbar if it's present.
     * Returns null if the slot is empty.
     * @param {alt.Player} playerRef
     * @param {Partial<Item>} item
     * @return {{ index: number } | null}
     * @memberof InventoryPrototype
     */
    isInToolbar(playerRef: alt.Player, item: Partial<Item>): { index: number } | null {
        return Inventory.isItemIn(playerRef, item, 'toolbar');
    },

    /**
     * Removes all weapons from the player's inventory.
     * Returns the list of removed weapons.
     * @param {alt.Player} player
     * @return {Array<Item>}
     */
    removeAllWeapons(player: alt.Player): Array<Item> {
        const weapons = Inventory.getAllItems(player).filter((item) => {
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

        Athena.state.setBulk(player, { inventory: player.data.inventory, equipment: player.data.equipment });
        Athena.player.sync.inventory(player);
        player.removeAllWeapons();
        return removedWeapons;
    },

    /**
     * Check if the player has a weapon.
     * Returns the item if they do.
     * @param {alt.Player} player
     * @return {(Item | null)}
     */
    hasWeapon(playerRef: alt.Player): Item | null {
        const player = playerRef as ReadOnlyPlayer;
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

            if (!isFlagEnabled(inventoryItem.behavior as number, ITEM_TYPE.IS_WEAPON)) {
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

            if (!isFlagEnabled(item.behavior as number, ITEM_TYPE.IS_WEAPON)) {
                continue;
            }

            return item as Item;
        }

        return null;
    },

    removeFrom(playerRef: alt.Player, slot: number, type: ItemGroup) {
        const player = playerRef as ReadOnlyPlayer;
        const index = player.data[type].findIndex((item) => item.slot === slot);
        if (index <= -1) {
            return false;
        }

        player.data[type].splice(index, 1);
        return true;
    },

    /**
     * Remove an item from equipment base don slot.
     * Does not save after removing item.
     * @param {EQUIPMENT_TYPE} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    equipmentRemove(playerRef: alt.Player, slot: EQUIPMENT_TYPE): boolean {
        if (slot >= MAX_EQUIPMENT_SLOTS) {
            return false;
        }

        return Inventory.removeFrom(playerRef, slot, 'equipment');
    },

    /**
     * Removes an item from the player.
     * Returns true if the item was removed successfully.
     * Automatically saves inventory or toolbar on removal.
     * @param {alt.Player} player
     * @param {string} itemName This is CaSeSeNsItIvE
     * @return {boolean}
     */
    findAndRemove(playerRef: alt.Player, itemName: string): boolean {
        const player = playerRef as ReadOnlyPlayer;
        const toolbarItem = Inventory.isInToolbar(player, { name: itemName });

        if (toolbarItem) {
            const item = player.data.toolbar[toolbarItem.index] as Item<ItemData>;
            if (typeof item === 'undefined' || typeof item.slot === 'undefined') {
                return false;
            }

            const removedFromToolbar = Inventory.toolbarRemove(player, item.slot);
            if (!removedFromToolbar) {
                return false;
            }

            Athena.state.set(player, 'toolbar', player.data.toolbar, true);
            Athena.player.sync.inventory(player);
            return true;
        }

        // Check Inventory Last
        const inventoryItem = Inventory.isInInventory(player, { name: itemName });
        if (!inventoryItem) {
            return false;
        }

        const item = player.data.inventory[inventoryItem.index];
        if (!item || typeof item === 'undefined' || typeof item.slot === 'undefined') {
            return false;
        }

        const removedFromInventory = Inventory.inventoryRemove(player, item.slot);
        if (!removedFromInventory) {
            return false;
        }

        Athena.state.set(player, 'inventory', player.data.inventory);
        Athena.player.sync.inventory(player);
        return true;
    },

    /**
     * Remove an item from this player's inventory.
     * Does not save after removing the item.
     * Returns if the item is successfully removed from the slot.
     * @param {alt.Player} player
     * @param {number} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    inventoryRemove(playerRef: alt.Player, slot: number): boolean {
        if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
            return false;
        }

        return Inventory.removeFrom(playerRef, slot, 'inventory');
    },

    /**
     * Add an item to this player's inventory.
     * If the tab & slot are not empty it will return false.
     * @param {alt.Player} player
     * @param {Item} item
     * @param {number} slot
     * @return {boolean}
     * @memberof InventoryPrototype
     */
    inventoryAdd(playerRef: alt.Player, item: Item, slot: number): boolean {
        const player = playerRef as ReadOnlyPlayer;
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

        const safeItemCopy = deepCloneObject<Item>(item);
        if (typeof player.data.inventory !== 'undefined') {
            player.data.inventory.push(safeItemCopy);
        } else {
            player.data.inventory = [safeItemCopy];
        }

        return true;
    },

    /**
     * Stacks or swaps items based on type, stackability, etc.
     * @param {alt.Player} player
     * @param {string} selectedSlot
     * @param {string} endSlot
     * @return {*}
     */
    handleSwapOrStack(player: alt.Player, selectedSlot: string, endSlot: string) {
        const fieldsToSave: Array<string> = [];
        const selectItem = Inventory.findItemBySlot(player, selectedSlot);
        const endItem = Inventory.findItemBySlot(player, endSlot);

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
        const selectedSlotName = Inventory.getSlotType(selectedSlot);
        const endSlotName = Inventory.getSlotType(endSlot);

        if (typeof selectedSlotName === 'undefined' || typeof endSlotName === 'undefined') {
            Athena.player.sync.inventory(player);
            return;
        }

        fieldsToSave.push(selectedSlotName);
        fieldsToSave.push(endSlotName);

        if (typeof newSelectSlot === 'undefined' || typeof newEndSlot === 'undefined') {
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

        if (typeof selectedArray === 'undefined' || typeof endArray === 'undefined') {
            Athena.player.sync.inventory(player);
            return;
        }

        // Do Not Stack. Swap Instead.
        if (selectItem.item.name !== endItem.item.name || selectItem.item.rarity !== selectItem.item.rarity) {
            // Need to verify that each slot follows the rules for the slot it is going into.
            // Handles rules for the end item slot.
            if (!Inventory.allItemRulesValid(selectItem.item, { name: endSlotName }, newEndSlot)) {
                Athena.player.sync.inventory(player);
                return;
            }

            // Handles rules for the selected item slot.
            if (!Inventory.allItemRulesValid(endItem.item, { name: selectedSlotName }, newSelectSlot)) {
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
            if (
                typeof endArray === 'object' &&
                endArray[endIndex].maxStack &&
                newValue > endArray[endIndex].maxStack!
            ) {
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

        Inventory.saveFields(player, fieldsToSave);
        Athena.player.sync.inventory(player);
    },
    saveFields(player: alt.Player, fields: string[]): void {
        const bulkDataToSave: { [key: string]: any } = {};

        for (let i = 0; i < fields.length; i++) {
            bulkDataToSave[fields[i]] = player.data[fields[i]];
        }

        Athena.state.setBulk(player, bulkDataToSave, true);
        Athena.player.sync.inventory(player);
    },

    /**
     * Checks rules for all items being moved in inventory.
     * @static
     * @param {Item} item
     * @param {CategoryData} endSlot
     * @param {number} endSlotIndex
     * @return {boolean}
     */
    allItemRulesValid(item: Item, endSlot: CategoryData, endSlotIndex: number | null): boolean {
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
                if (typeof endSlotIndex === 'undefined' || endSlotIndex === null) {
                    return false;
                }

                if (!Inventory.isEquipmentSlotValid(item, endSlotIndex)) {
                    return false;
                }
            }
        }

        return true;
    },

    findItemBySlot(playerRef: alt.Player, selectedSlot: string): { item: Item; index: number } | null {
        const player = playerRef as ReadOnlyPlayer;

        // Inventory
        if (selectedSlot.includes('i')) {
            const item = Inventory.getInventoryItem(player, stripCategory(selectedSlot));
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
            const item = Inventory.getEquipmentItem(player, stripCategory(selectedSlot));
            if (!item) {
                return null;
            }

            return { item: deepCloneObject(item), index: player.data.equipment.findIndex((i) => i.slot === item.slot) };
        }

        // Toolbar
        if (selectedSlot.includes('t')) {
            const item = Inventory.getToolbarItem(player, stripCategory(selectedSlot));
            if (!item) {
                return null;
            }

            return { item: deepCloneObject(item), index: player.data.toolbar.findIndex((i) => i.slot === item.slot) };
        }

        return null;
    },

    /**
     * Get an inventory item based on slot.
     * @param { alt.Player } player
     * @param { number } slot
     * @return { Item | null }
     * @memberof InventoryPrototype
     */

    getInventoryItem(player: alt.Player, slot: number): Item | null {
        if (slot >= TEMP_MAX_INVENTORY_SLOTS) {
            return null;
        }

        return Inventory.getItemBySlot(player, slot, 'inventory');
    },

    /**
     * Scans the players inventory to try and find a key / value pair in the 'data' section.
     * Useful to find an arbitrary item with a key / value pair.
     *
     *
     * @param {alt.Player} player
     * @param {string} key
     * @param {*} value
     */
    checkForKeyValuePair(playerRef: alt.Player, key: string, value: any) {
        const player = playerRef as ReadOnlyPlayer;
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
    },

    /**
     * Checks if the equipment slot the item is going to is correct.
     * @param {Item} item
     * @param {EQUIPMENT_TYPE} slot Is the 'item.slot' the item will go to.
     * @return {*}
     */
    isEquipmentSlotValid(item: Item, slot: EQUIPMENT_TYPE) {
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
    },

    /**
     * Return the slot to use for adding an item.
     * @param { alt.Player } playerRef
     * @return { { slot: number } }
     * @memberof InventoryPrototype
     */
    getFreeInventorySlot(playerRef: alt.Player): { slot: number } | null {
        const player = playerRef as ReadOnlyPlayer;
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
    },

    /**
     * Return slots available in the player's inventory.
     * @param { alt.Player } player
     * @return { Array<{ slot: number }> }
     * @memberof InventoryPrototype
     */
    getFreeInventorySlots(playerRef: alt.Player): Array<{ slot: number }> {
        const player = playerRef as ReadOnlyPlayer;
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
    },

    /**
     * Replaces an existing item with an updated version of itself.
     * Uses the same item slot.
     * Does not save.
     * @param {alt.Player} player
     * @param {Item} item
     * @return {*}  {boolean}
     */
    replaceInventoryItem(playerRef: alt.Player, item: Item): boolean {
        const player = playerRef as ReadOnlyPlayer;
        const itemIndex = player.data.inventory.findIndex((existingItem) => existingItem.slot === item.slot);
        if (itemIndex <= -1) {
            return false;
        }

        player.data.inventory[itemIndex] = item;
        return true;
    },

    /**
     * Replaces an existing item with an updated version of itself.
     * Uses the same item slot.
     * Does not save.
     * @param {alt.Player} player
     * @param {Item} item
     * @return {boolean}
     */
    replaceToolbarItem(playerRef: alt.Player, item: Item): boolean {
        const player = playerRef as ReadOnlyPlayer;
        const itemIndex = player.data.toolbar.findIndex((existingItem) => existingItem.slot === item.slot);
        if (itemIndex <= -1) {
            return false;
        }

        player.data.toolbar[itemIndex] = item;
        return true;
    },

    /**
     * Stack an item in the player's inventory.
     * @param {alt.Player} player
     * @param {Item} item
     * @return {boolean}
     */
    stackInventoryItem(playerRef: alt.Player, item: Item): boolean {
        const player = playerRef as ReadOnlyPlayer;
        const existingItem = Inventory.isInInventory(player, item);

        if (existingItem === null || typeof existingItem === 'undefined' || typeof existingItem.index === 'undefined') {
            return false;
        }

        if (item.rarity !== player.data.inventory[existingItem.index].rarity) {
            return false;
        }

        const newSize = player.data.inventory[existingItem.index].quantity! + item.quantity;
        if (item.maxStack && newSize > item.maxStack) {
            return false;
        }

        player.data.inventory[existingItem.index].quantity! += item.quantity;
        Athena.state.set(player, 'inventory', player.data.inventory, true);
        Athena.player.sync.inventory(player);
        return true;
    },

    /**
     * Used to send information to the in-game menu of the inventory if it is open.
     * @param {alt.Player} player
     * @param {string} info
     */
    notify(player: alt.Player, info: string) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_NOTIFICATION, info);
    },

    /**
     * Gets weight from the entire inventory.
     * Weight can be assigned to an item by putting 'weight' in data.
     * @param {alt.Player} player
     * @return {number}
     */
    getTotalWeight(playerRef: alt.Player): number {
        const player = playerRef as ReadOnlyPlayer;
        if (!player.data.inventory) {
            return 0;
        }

        const inventory = [...player.data.inventory];
        let total = 0;

        for (let i = 0; i < inventory.length; i++) {
            const item = inventory[i] as Item;
            if (!item) {
                continue;
            }

            if (!item.data) {
                continue;
            }

            if (!item.data.weight) {
                continue;
            }

            if (!item.quantity) {
                continue;
            }

            total += parseFloat(item.data.weight) * item.quantity;
        }

        return total;
    },

    /**
     * Remove amount of item from this player's inventory by looking into slots and quantities
     * Does not save after removing the items.
     *
     * @param {alt.Player} player
     * @param {itemToRemove} item to Remove
     * @param {amount} amount to be removed from Inventory
     * @return {number} amount left if inventory hadn't enough to remove.
     * @memberof InventoryPrototype
     */
    async removeAmountFromInventoryReturnRemainingAmount(
        playerRef: alt.Player,
        itemDbName: string,
        amount: number,
    ): Promise<number> {
        const player = playerRef as ReadOnlyPlayer;
        let amountToBeRemoved = amount;
        for (let i = player.data.inventory.length - 1; i >= 0; i--) {
            if (amountToBeRemoved <= 0) {
                return amountToBeRemoved;
            }

            let inventoryItem = player.data.inventory[i] as Item;
            if (typeof inventoryItem === 'undefined' || typeof inventoryItem.slot === 'undefined') {
                continue;
            }

            if (inventoryItem.dbName !== itemDbName) {
                continue;
            }

            // How much is left on this stack...
            if (inventoryItem.quantity === amountToBeRemoved) {
                Inventory.inventoryRemove(player, inventoryItem.slot);
                return 0;
            }

            if (inventoryItem.quantity > amountToBeRemoved) {
                //Everything we want to remove is here
                inventoryItem.quantity -= amountToBeRemoved;
                return 0;
            }

            // We remove the whole item-stack
            amountToBeRemoved -= inventoryItem.quantity;
            Inventory.inventoryRemove(player, inventoryItem.slot);
        }

        return amountToBeRemoved;
    },

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
    async addAmountToInventoryReturnRemainingAmount(
        playerRef: alt.Player,
        itemDbName: string,
        amount: number,
    ): Promise<number> {
        const player = playerRef as ReadOnlyPlayer;

        const itemToAdd = await ItemFactory.get(itemDbName);
        if (typeof itemToAdd === 'undefined' || itemToAdd === null) {
            return amount;
        }

        let itemsLeftToStoreInInventory = amount * itemToAdd.quantity;
        if (isFlagEnabled(itemToAdd.behavior, ITEM_TYPE.CAN_STACK)) {
            for (let inventoryItem of player.data.inventory) {
                if (itemsLeftToStoreInInventory <= 0) {
                    return 0;
                }

                // Match dbName
                if (inventoryItem.dbName && itemToAdd.dbName && inventoryItem.dbName !== itemToAdd.dbName) {
                    continue;
                }

                // Match rarity
                if (inventoryItem.rarity && itemToAdd.rarity && inventoryItem.rarity !== itemToAdd.rarity) {
                    continue;
                }

                // Check stack ability
                if (!isFlagEnabled(inventoryItem.behavior as number, ITEM_TYPE.CAN_STACK)) {
                    continue;
                }

                // Set quantity to zero if item somehow has zero quantity.
                if (typeof inventoryItem.quantity === 'undefined') {
                    inventoryItem.quantity = 0;
                }

                if (typeof inventoryItem.maxStack === 'undefined') {
                    inventoryItem.quantity += itemsLeftToStoreInInventory;
                    return 0;
                }

                // How much is left to stack?
                let addedToStack = inventoryItem.maxStack - inventoryItem.quantity;

                // Everything we add fits on top of this stack
                if (addedToStack >= itemsLeftToStoreInInventory) {
                    inventoryItem.quantity += itemsLeftToStoreInInventory;
                    return 0;
                }

                // We still have something left. So we fill this stack and move on
                inventoryItem.quantity = inventoryItem.maxStack;
                itemsLeftToStoreInInventory -= addedToStack;
            }
        }

        const emptySlots = Inventory.getFreeInventorySlots(player);
        if (emptySlots.length <= 0) {
            return itemsLeftToStoreInInventory;
        }

        // Either there is something left or wasn't stackable. So go for the Empty-Slots
        if (itemsLeftToStoreInInventory >= itemToAdd.quantity) {
            for (let emptySlot of emptySlots) {
                if (itemsLeftToStoreInInventory <= 0) {
                    return 0;
                }

                const itemRef: Item = deepCloneObject<Item>(itemToAdd);
                if (!isFlagEnabled(itemToAdd.behavior as number, ITEM_TYPE.CAN_STACK)) {
                    itemRef.quantity = 1;
                    itemsLeftToStoreInInventory -= 1;
                    Inventory.inventoryAdd(player, itemRef, emptySlot.slot);
                    continue;
                }

                if (typeof itemToAdd.maxStack === 'undefined' || itemToAdd.maxStack >= itemsLeftToStoreInInventory) {
                    itemRef.quantity = itemsLeftToStoreInInventory;
                    itemsLeftToStoreInInventory = 0;
                    Inventory.inventoryAdd(player, itemRef, emptySlot.slot);
                    continue;
                }

                //We still have something left. So we fill this stack and move on
                itemRef.quantity = itemToAdd.maxStack;
                itemsLeftToStoreInInventory -= itemToAdd.maxStack;
            }
        }

        // We have less then itemToAdd.quantity left when inventory was full, so
        if (itemsLeftToStoreInInventory > 0 && itemsLeftToStoreInInventory < itemToAdd.quantity) {
            return 1;
        }

        return itemsLeftToStoreInInventory / itemToAdd.quantity;
    },

    /**
     * Simply unequips an equipment slot item.
     * Will return false if it did not remove from the slot.
     * Auto-saves on unequip.
     *
     * @param {alt.Player} player
     * @param {EQUIPMENT_TYPE} slot
     */
    async unequip(playerRef: alt.Player, slot: EQUIPMENT_TYPE): Promise<boolean> {
        const player = playerRef as ReadOnlyPlayer;
        const equipmentIndex = player.data.equipment.findIndex((x) => x.slot === slot);
        if (!equipmentIndex) {
            return true;
        }

        if (Inventory.isEquipmentSlotFree(player, slot)) {
            return true;
        }

        const emptySlot = Inventory.getFreeInventorySlot(player);
        if (!emptySlot) {
            return false;
        }

        const equipment = player.data.equipment[equipmentIndex];
        const didAdd = Inventory.inventoryAdd(player, equipment as Item, emptySlot.slot);
        if (!didAdd) {
            return false;
        }

        player.data.equipment.splice(equipmentIndex, 1);
        await save.partial(player, { equipment: player.data.equipment, inventory: player.data.inventory });
        await sync.equipment(
            player,
            player.data.equipment as Array<Item<ClothingComponent>>,
            player.data.appearance.sex === 1,
        );
        return true;
    },
};

/**
 * It takes a function name and a callback, and if the function name exists in the exports object, it
 * overrides it with the callback
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Inventory>(functionName: Key, callback: typeof Inventory[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`Athena.player.inventory does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

const exports: typeof Inventory & { override?: typeof override } = {
    ...Inventory,
    override,
};

export default exports;
