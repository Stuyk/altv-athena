import * as alt from 'alt-server';
import { View_Events_Inventory } from '../../shared/enums/views';
import { Item } from '../../shared/interfaces/Item';

function stripCategory(value: string): number {
    return parseInt(value.replace(/.-/gm, ''));
}

/**
 * Let's talk about Inventory Logic! Woo!
 *
 * Inventories are complicated but here at Athena we want to simplify that process.
 * You cannot swap an item with another item.
 * Drag one out. Put one in. Simple.
 * Hard to come across bugs when you have to look for null slots.
 *
 * i - is for inventory
 * e - is for equipment
 * tab - is for a tab, belongs under inventory
 * g - is for ground
 * t - is for toolbar
 *
 * There are a ton of methods to help you along with managing inventory state.
 * They all fall under player.inventory().x
 *
 * The functions are rebound below so we can create this abstract solution for handling items.
 * Makes it nice and neat and keeps all the underlying code elsewhere.
 */

export class InventoryController {
    static groundItems = [];

    static processItemMovement(player: alt.Player, selectedSlot: string, endSlot: string, tab: number): void {
        if (!player || !player.valid) {
            return;
        }

        if (selectedSlot === endSlot) {
            player.sync().inventory();
            return;
        }

        // The data locations on `player.data` we are using.
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
        const endData = DataHelpers.find((dataInfo) => endSlot.includes(dataInfo.abbrv));

        console.log(selectData);
        console.log(endData);

        const endSlotIndex = stripCategory(endSlot);

        // Check if the end slot is available.
        if (endData.emptyCheck && !endData.emptyCheck(player, endSlotIndex, tab)) {
            alt.log('That slot is not available');
            player.sync().inventory();
            return;
        }

        const selectSlotIndex = stripCategory(selectedSlot);
        const itemClone = selectData.getItem(player, selectSlotIndex, tab);

        if (!itemClone) {
            alt.log('That item does not exist');
            player.sync().inventory();
            return;
        }

        const didRemoveItem = selectData.removeItem(player, itemClone.slot, tab);
        if (!didRemoveItem) {
            alt.log('Could not remove item');
            player.sync().inventory();
            return;
        }

        const didAddItem = endData.addItem(player, itemClone, endSlotIndex, tab);
        if (!didAddItem) {
            alt.log('Could not add item');
            player.sync().inventory();
            return;
        }

        player.save().field(selectData.name, player.data[selectData.name]);
        player.save().field(endData.name, player.data[endData.name]);
        player.sync().inventory();
        console.log('success?');
    }

    static isInventorySlotNull(player: alt.Player, slot: number, tab: number): boolean {
        return player.inventory().isInventorySlotFree(tab, slot);
    }

    static isEquipmentSlotNull(player: alt.Player, slot: number): boolean {
        return player.inventory().isEquipmentSlotFree(slot);
    }

    static isToolbarSlotNull(player: alt.Player, slot: number): boolean {
        return player.inventory().isToolbarSlotFree(slot);
    }

    static getEquipmentItem(player: alt.Player, slot: number): Item | null {
        return player.inventory().getEquipmentItem(slot);
    }

    static getInventoryItem(player: alt.Player, slot: number, tab: number): Item | null {
        return player.inventory().getInventoryItem(tab, slot);
    }

    static getToolbarItem(player: alt.Player, slot: number): Item | null {
        return player.inventory().getToolbarItem(slot);
    }

    static removeInventoryItem(player: alt.Player, slot: number, tab: number): boolean {
        return player.inventory().inventoryRemove(tab, slot);
    }

    static removeToolbarItem(player: alt.Player, slot: number): boolean {
        return player.inventory().toolbarRemove(slot);
    }

    static removeEquipmentItem(player: alt.Player, slot: number): boolean {
        return player.inventory().equipmentRemove(slot);
    }

    static addInventoryItem(player: alt.Player, item: Item, slot: number, tab: number): boolean {
        return player.inventory().inventoryAdd(item, slot, tab);
    }

    static addEquipmentItem(player: alt.Player, item: Item, slot: number): boolean {
        return player.inventory().equipmentSet(item, slot);
    }

    static addToolbarItem(player: alt.Player, item: Item, slot: number): boolean {
        return player.inventory().toolbarSet(item, slot);
    }
}

const DataHelpers: Array<{
    abbrv: string;
    name: string;
    emptyCheck: Function;
    getItem: Function;
    removeItem: Function;
    addItem: Function;
}> = [
    {
        abbrv: 'i-',
        name: 'inventory',
        emptyCheck: InventoryController.isInventorySlotNull,
        getItem: InventoryController.getInventoryItem,
        removeItem: InventoryController.removeInventoryItem,
        addItem: InventoryController.addInventoryItem
    },
    {
        abbrv: 't-',
        name: 'toolbar',
        emptyCheck: InventoryController.isToolbarSlotNull,
        getItem: InventoryController.getToolbarItem,
        removeItem: InventoryController.removeToolbarItem,
        addItem: InventoryController.addToolbarItem
    },
    {
        abbrv: 'e-',
        name: 'equipment',
        emptyCheck: InventoryController.isEquipmentSlotNull,
        getItem: InventoryController.getEquipmentItem,
        removeItem: InventoryController.removeEquipmentItem,
        addItem: InventoryController.addEquipmentItem
    },
    { abbrv: 'g-', name: 'ground', emptyCheck: null, getItem: null, removeItem: null, addItem: null }
];

alt.onClient(View_Events_Inventory.Process, InventoryController.processItemMovement);
