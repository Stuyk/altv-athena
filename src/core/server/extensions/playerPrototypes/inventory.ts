import * as alt from 'alt-server';
import { EquipmentType } from '../../../shared/enums/equipment';
import { InventoryType } from '../../../shared/enums/inventoryTypes';
import { Item } from '../../../shared/interfaces/Item';

export interface InventoryPrototype {
    /**
     * Add an item to this player's inventory.
     * If the tab & slot are not empty it will return false.
     * @param {Item} item
     * @param {number} tab
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    inventoryAdd(item: Item, tab: number, slot: number): boolean;

    /**
     * Remove an item from this player's inventory.
     * Returns if the item is successfully removed from the slot.
     * @param {number} tab
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    inventoryRemove(tab: number, slot: number): boolean;

    /**
     * Check if an equipment slot is free.
     * @param {EquipmentType} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    isEquipmentSlotFree(slot: EquipmentType): boolean;

    /**
     * Checks if an item is in the equipment data section.
     * Returns the index in the array of where this item is.
     * @param {Partial<Item>} item
     * @return {*}  {({ index: number } | null)}
     * @memberof InventoryPrototype
     */
    isInEquipment(item: Partial<Item>): { index: number } | null;

    /**
     * Checks if an item is in the inventory data section.
     * Returns the tab in the inventory where it is.
     * Returns the index in the array of where this item is.
     * @param {InventoryType} type
     * @param {string} uuid
     * @return {boolean}  {Promise<void>}
     * @memberof InventoryPrototype
     */
    isInInventory(item: Partial<Item>): { tab: number; index: number } | null;

    /**
     * Checks if an item is in the toolbar data section.
     * Returns the index of the toolbar if it's present.
     * Returns null if the slot is empty.
     * @param {Partial<Item>} item
     * @return {*}  {({ index: number } | null)}
     * @memberof InventoryPrototype
     */
    isInToolbar(item: Partial<Item>): { index: number } | null;

    /**
     * Check if a slot in the toolbar is free.
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    isToolbarSlotFree(slot: number): boolean;

    /**
     * Return the tab index and the slot to use for the item.
     * @return {*}  {({ tab: number; index: number } | null)}
     * @memberof InventoryPrototype
     */
    getFreeInventorySlot(): { tab: number; slot: number } | null;

    /**
     * Remove an item from equipment base don slot.
     * @param {EquipmentType} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    equipmentRemove(slot: EquipmentType): boolean;

    /**
     * Sets an item into the equipment section of this inventory.
     * @param {Item} item
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    equipmentSet(item: Item, slot: EquipmentType): boolean;

    /**
     * Removes an item from this player's toolbar.
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    toolbarRemove(slot: number): boolean;

    /**
     * Sets an item into the toolbar section of this player.
     * Returns true if it was successfully set.
     * @param {Item} item
     * @param {number} slot
     * @return {*}  {boolean}
     * @memberof InventoryPrototype
     */
    toolbarSet(item: Item, slot: number): boolean;
}

export function bind(): InventoryPrototype {
    const _this = this;
    // Inventory
    _this.getFreeInventorySlot = getFreeInventorySlot;
    _this.inventoryAdd = inventoryAdd;
    _this.inventoryRemove = inventoryRemove;
    _this.isInInventory = isInInventory;

    // Equipment
    _this.isEquipmentSlotFree = isEquipmentSlotFree;
    _this.isInEquipment = isInEquipment;
    _this.equipmentRemove = equipmentRemove;
    _this.equipmentSet = equipmentSet;

    // Toolbar
    _this.isInToolbar = isInToolbar;
    _this.isToolbarSlotFree = isToolbarSlotFree;
    _this.toolbarRemove = toolbarRemove;
    _this.toolbarSet = toolbarSet;
    return _this;
}

function getFreeInventorySlot(): { tab: number; slot: number } | null {
    const p: alt.Player = (this as unknown) as alt.Player;

    for (let i = 0; i < p.data.inventory.length; i++) {
        const tab = p.data.inventory[i];

        // Go to next tab if inventory is full.
        if (tab.length > 27) {
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

function isInInventory(item: Partial<Item>): { tab: number; index: number } | null {
    const p: alt.Player = (this as unknown) as alt.Player;

    for (let t = 0; t < p.data.inventory.length; t++) {
        const tab = p.data.inventory[t];
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

function isInEquipment(item: Partial<Item>): { index: number } | null {
    const p: alt.Player = (this as unknown) as alt.Player;

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

function isEquipmentSlotFree(slot: EquipmentType): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (p.data.equipment.length <= 0) {
        return true;
    }

    return p.data.equipment.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

function inventoryAdd(item: Item, tab: number, slot: number): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

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

    p.data.inventory[tab].push(item);
    p.save().field(InventoryType.INVENTORY, p.data.inventory);
    return true;
}

function inventoryRemove(tab: number, slot: number): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (slot >= 28) {
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
    p.save().field(InventoryType.INVENTORY, p.data.inventory);
    return true;
}

function equipmentRemove(slot: EquipmentType): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

    const index = p.data.equipment.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    p.data.equipment.splice(index, 1);
    return true;
}

function equipmentSet(item: Item, slot: EquipmentType): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (!p.inventory().isEquipmentSlotFree(slot)) {
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

    p.data.equipment.push(item);
    p.save().field(InventoryType.EQUIPMENT, p.data.equipment);
    return true;
}

function isToolbarSlotFree(slot: number): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (p.data.toolbar.length >= 4) {
        return false;
    }

    return p.data.toolbar.findIndex((item) => item.slot === slot) === -1 ? true : false;
}

function toolbarSet(item: Item, slot: number): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (!p.inventory().isToolbarSlotFree(slot)) {
        return false;
    }

    // Update slot to match where it needs to go.
    if (item.slot !== slot) {
        item.slot = slot;
    }

    p.data.equipment.push(item);
    p.save().field(InventoryType.EQUIPMENT, p.data.equipment);
    return true;
}

function toolbarRemove(slot: number): boolean {
    const p: alt.Player = (this as unknown) as alt.Player;
    const index = p.data.toolbar.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    p.data.toolbar.splice(index, 1);
    return true;
}

function isInToolbar(item: Partial<Item>): { index: number } | null {
    const p: alt.Player = (this as unknown) as alt.Player;

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
