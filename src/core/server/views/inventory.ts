import * as alt from 'alt-server';
import { InventoryType } from '../../shared/enums/inventoryTypes';
import { ItemType } from '../../shared/enums/itemType';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Inventory } from '../../shared/enums/views';
import { DroppedItem, Item } from '../../shared/interfaces/Item';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance2d } from '../../shared/utility/vector';
import { playerFuncs } from '../extensions/Player';
import { sha256Random } from '../utility/encryption';

interface CategoryData {
    abbrv: string;
    name: string;
    emptyCheck?: Function;
    getItem?: Function;
    removeItem?: Function;
    addItem?: Function;
}

function stripCategory(value: string): number {
    return parseInt(value.replace(/.*-/gm, ''));
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
    static groundItems: Array<DroppedItem> = [];

    static processItemMovement(
        player: alt.Player,
        selectedSlot: string,
        endSlot: string,
        tab: number,
        hash: string | null
    ): void {
        if (!player || !player.valid) {
            return;
        }

        if (selectedSlot === endSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }

        // The data locations on `player.data` we are using.
        const endData = DataHelpers.find((dataInfo) => endSlot.includes(dataInfo.abbrv));
        const endSlotIndex = stripCategory(endSlot);

        // Handle Drop Ground
        if (endData.name === InventoryType.GROUND) {
            InventoryController.handleDropGround(player, selectedSlot, tab);
            return;
        }

        // Check if the end slot is available.
        if (endData.emptyCheck && !endData.emptyCheck(player, endSlotIndex, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));

        // Pickup Item from Ground
        if (selectData.name === InventoryType.GROUND) {
            InventoryController.handlePickupGround(player, endData, endSlotIndex, hash, tab);
            return;
        }

        const selectSlotIndex = stripCategory(selectedSlot);
        const itemClone = selectData.getItem(player, selectSlotIndex, tab);

        if (!itemClone) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (endData.name === InventoryType.TAB) {
            InventoryController.handleMoveTabs(
                player,
                itemClone,
                selectSlotIndex,
                tab,
                endSlotIndex,
                selectData.name,
                endData.name
            );
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
     * Move an item to a different tab.
     * We know the item exists when this function is called.
     * @static
     * @param {alt.Player} player
     * @param {Item} item
     * @memberof InventoryController
     */
    static handleMoveTabs(
        player: alt.Player,
        item: Item,
        selectSlotIndex: number,
        tab: number,
        tabToMoveTo: number,
        selectName: string,
        endName: string
    ) {
        const freeSlot = playerFuncs.inventory.getFreeInventorySlot(player, tabToMoveTo);
        if (!freeSlot) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (!playerFuncs.inventory.inventoryRemove(player, selectSlotIndex, tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (!playerFuncs.inventory.inventoryAdd(player, item, freeSlot.slot, freeSlot.tab)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        playerFuncs.save.field(player, selectName, player.data[selectName]);
        playerFuncs.save.field(player, endName, player.data[endName]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    /**
     * Propogates the item to appear on the ground.
     * @static
     * @param {string} selectedSlot
     * @param {number} tab
     * @memberof InventoryController
     */
    static handleDropGround(player: alt.Player, selectedSlot: string, tab: number) {
        const selectSlotIndex = stripCategory(selectedSlot);
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));

        if (selectData.name === InventoryType.GROUND) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const itemClone = selectData.getItem(player, selectSlotIndex, tab);

        if (player.vehicle) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (!itemClone) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (!isFlagEnabled(itemClone.behavior, ItemType.CAN_DROP)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const didRemoveItem = selectData.removeItem(player, itemClone.slot, tab);
        if (!didRemoveItem) {
            playerFuncs.sync.inventory(player);
            return;
        }

        playerFuncs.save.field(player, selectData.name, player.data[selectData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_drop_1', Math.random() * 0.45 + 0.1);

        itemClone.hash = sha256Random(JSON.stringify(itemClone));
        InventoryController.groundItems.push({
            gridSpace: player.gridSpace,
            item: itemClone,
            position: playerFuncs.utility.getPositionFrontOf(player, 1),
            dimension: player.dimension
        });

        this.updateDroppedItemsAroundPlayer(player, true);
        playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
    }

    static getDroppedItemsByGridSpace(gridSpace: number): Array<DroppedItem> {
        return InventoryController.groundItems.filter((item) => item.gridSpace === gridSpace);
    }

    static updateDroppedItemsAroundPlayer(player: alt.Player, updateOtherPlayers: boolean): void {
        let players = [player];

        if (updateOtherPlayers) {
            players = playerFuncs.utility.getClosestPlayers(player, 50);
        }

        const items = InventoryController.getDroppedItemsByGridSpace(player.gridSpace);
        for (let i = 0; i < players.length; i++) {
            const target = players[i];
            if (!target || !target.valid) {
                continue;
            }

            alt.emitClient(target, SYSTEM_EVENTS.POPULATE_ITEMS, items);
        }
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

        // Not droppable but trying to drop on ground.
        if (!isFlagEnabled(item.behavior, ItemType.CAN_DROP) && endSlot.name === InventoryType.GROUND) {
            return false;
        }

        // Not equipment but going into equipment.
        if (!isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT) {
            return false;
        }

        // Not a toolbar item but going into toolbar.
        if (!isFlagEnabled(item.behavior, ItemType.IS_TOOLBAR) && endSlot.name === InventoryType.TOOLBAR) {
            return false;
        }

        // Is equipment and is going into an equipment slot.
        if (isFlagEnabled(item.behavior, ItemType.IS_EQUIPMENT) && endSlot.name === InventoryType.EQUIPMENT) {
            if (!playerFuncs.inventory.isEquipmentSlotValid(item, endSlotIndex)) {
                return false;
            }
        }

        return true;
    }

    static handlePickupGround(
        player: alt.Player,
        endData: CategoryData,
        endSlotIndex: number,
        hash: string | null,
        tab: number
    ) {
        if (player.vehicle) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (!hash) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const index = InventoryController.groundItems.findIndex((gItem) => gItem.item.hash === hash);
        if (index <= -1) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const droppedItem: DroppedItem = { ...InventoryController.groundItems[index] };
        if (distance2d(player.pos, droppedItem.position) >= 10) {
            playerFuncs.sync.inventory(player);
            return;
        }

        if (!InventoryController.allItemRulesValid(droppedItem.item, endData, endSlotIndex)) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const removedItems = InventoryController.groundItems.splice(index, 1);
        if (removedItems.length <= 0) {
            playerFuncs.sync.inventory(player);
            return;
        }

        const didAddItem = endData.addItem(player, droppedItem.item, endSlotIndex, tab);
        if (!didAddItem) {
            playerFuncs.sync.inventory(player);
            return;
        }

        playerFuncs.save.field(player, endData.name, player.data[endData.name]);
        playerFuncs.sync.inventory(player);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
        playerFuncs.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
        this.updateDroppedItemsAroundPlayer(player, true);
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
    { abbrv: 'g-', name: 'ground', emptyCheck: null, getItem: null, removeItem: null, addItem: null },
    {
        abbrv: 'tab-',
        name: 'tab',
        emptyCheck: null,
        getItem: null,
        removeItem: null,
        addItem: null
    }
];

alt.onClient(View_Events_Inventory.Process, InventoryController.processItemMovement);
