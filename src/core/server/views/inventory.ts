import * as alt from 'alt-server';
import { InventoryType } from '../../shared/enums/inventoryTypes';
import { ItemType } from '../../shared/enums/itemType';
import { View_Events_Inventory } from '../../shared/enums/views';
import { Item } from '../../shared/interfaces/Item';
import { isFlagEnabled } from '../../shared/utility/flags';
import { playerFuncs } from '../extensions/Player';

interface CategoryData {
    abbrv: string;
    name: string;
    emptyCheck?: Function;
    getItem?: Function;
    removeItem?: Function;
    addItem?: Function;
}

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

        if (!InventoryController.allItemRulesValid(itemClone, endData, endSlotIndex)) {
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
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    /**
     * Checks rules for all items being moved in inventory.
     * @static
     * @param {Item} item
     * @param {CategoryData} endSlot
     * @param {number} endSlotIndex
     * @return {*}  {boolean}
     * @memberof InventoryController
     */
    static allItemRulesValid(item: Item, endSlot: CategoryData, endSlotIndex: number): boolean {
        if (!item.behavior) {
            return true;
        }

        // If the item cannot be dropped.
        if (!isFlagEnabled(item.behavior, ItemType.CAN_DROP) && endSlot.name === InventoryType.GROUND) {
            return false;
        }

        // If the item is being dragged into equipment and is not equipment.
        if (!isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT) {
            return false;
        }

        // If the item is not marked as a tool but is being dragged into a toolbar.
        if (!isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR) && endSlot.name === InventoryType.TOOLBAR) {
            return false;
        }

        // Check if this is the correct inventory slot for an equipment item.
        if (isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT) {
            if (!playerFuncs.inventory.isEquipmentSlotValid(item, endSlotIndex)) {
                return false;
            }
        }

        return true;
    }
}

const DataHelpers: Array<CategoryData> = [
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
