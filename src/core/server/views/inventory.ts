import * as alt from 'alt-server';
import { View_Events_Inventory } from '../../shared/enums/views';
import { Item } from '../../shared/interfaces/Item';
import { playerFuncs } from '../extensions/Player';

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
            playerFuncs.sync.inventory(player);
            return;
        }

        // The data locations on `player.data` we are using.
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));
        const endData = DataHelpers.find((dataInfo) => endSlot.includes(dataInfo.abbrv));
        const endSlotIndex = stripCategory(endSlot);

        // Check if the end slot is available.
        if (endData.emptyCheck && !endData.emptyCheck(player, endSlotIndex, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const selectSlotIndex = stripCategory(selectedSlot);
        const itemClone = selectData.getItem(player, selectSlotIndex, tab);

        if (!itemClone) {
            playerFuncs.sync.inventory(player);
            return;
        }

        // Check Equipment Validity
        if (endData.name === 'equipment' && !playerFuncs.inventory.isEquipmentSlotValid(itemClone.slot, endSlotIndex)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const didRemoveItem = selectData.removeItem(player, itemClone.slot, tab);
        if (!didRemoveItem) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const didAddItem = endData.addItem(player, itemClone, endSlotIndex, tab);
        if (!didAddItem) {
            playerFuncs.sync.inventory(player);
            return;
        }

        playerFuncs.save.field(player, selectData.name, player.data[selectData.name]);
        playerFuncs.save.field(player, endData.name, player.data[endData.name]);
        playerFuncs.sync.inventory(player);
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
        emptyCheck: playerFuncs.inventory.isInventorySlotFree,
        getItem: playerFuncs.inventory.getInventoryItem,
        removeItem: playerFuncs.inventory.inventoryRemove,
        addItem: playerFuncs.inventory.inventoryAdd
    },
    {
        abbrv: 't-',
        name: 'toolbar',
        emptyCheck: playerFuncs.inventory.isToolbarSlotFree,
        getItem: playerFuncs.inventory.getToolbarItem,
        removeItem: playerFuncs.inventory.toolbarRemove,
        addItem: playerFuncs.inventory.toolbarAdd
    },
    {
        abbrv: 'e-',
        name: 'equipment',
        emptyCheck: playerFuncs.inventory.isEquipmentSlotFree,
        getItem: playerFuncs.inventory.getEquipmentItem,
        removeItem: playerFuncs.inventory.equipmentRemove,
        addItem: playerFuncs.inventory.equipmentAdd
    },
    { abbrv: 'g-', name: 'ground', emptyCheck: null, getItem: null, removeItem: null, addItem: null }
];

alt.onClient(View_Events_Inventory.Process, InventoryController.processItemMovement);
