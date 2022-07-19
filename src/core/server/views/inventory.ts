import * as alt from 'alt-server';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { View_Events_Inventory } from '../../shared/enums/views';
import { DroppedItem, Item } from '../../shared/interfaces/item';
import { isFlagEnabled } from '../../shared/utility/flags';
import { sha256Random } from '../utility/encryption';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { stripCategory } from '../utility/category';
import { CategoryData } from '../interface/iCategoryData';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { distance2d } from '../../shared/utility/vector';
import { INVENTORY_RULES } from '../../shared/enums/inventoryRules';
import { SLOT_TYPE } from '../../shared/enums/inventorySlotTypes';
import { ServerItemController } from '../streamers/item';
import { ServerObjectController } from '../streamers/object';
import { PlayerEvents } from '../events/playerEvents';
import { ItemEffects } from '../systems/itemEffects';
import { playerConst } from '../api/consts/constPlayer';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { stateConst } from '../api/consts/constState';

const GROUND_ITEMS: Array<DroppedItem> = [];

// These are all custom rules that can be defined for custom functionality.
// Use the addItemRule function in the InventoryView.
const ITEM_RULES: { [key: string]: Function[] } = {
    [INVENTORY_RULES.FROM_EQUIPMENT_TO_INVENTORY]: [],
    [INVENTORY_RULES.FROM_EQUIPMENT_TO_TOOLBAR]: [],
    [INVENTORY_RULES.FROM_INVENTORY_TO_EQUIPMENT]: [],
    [INVENTORY_RULES.FROM_INVENTORY_TO_GROUND]: [], //
    [INVENTORY_RULES.FROM_INVENTORY_TO_TOOLBAR]: [],
    [INVENTORY_RULES.FROM_TOOLBAR_TO_EQUIPMENT]: [],
    [INVENTORY_RULES.FROM_TOOLBAR_TO_INVENTORY]: [],
    [INVENTORY_RULES.FROM_EQUIPMENT_TO_GROUND]: [], //
    [INVENTORY_RULES.FROM_TOOLBAR_TO_GROUND]: [], //
    [INVENTORY_RULES.FROM_GROUND_TO_INVENTORY]: [], //
    [INVENTORY_RULES.FROM_GROUND_TO_EQUIPMENT]: [], //
    [INVENTORY_RULES.FROM_GROUND_TO_TOOLBAR]: [], //
};

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
 * g - is for ground
 * t - is for toolbar
 *
 * There are a ton of methods to help you along with managing inventory state.
 * They all fall under player.inventory().x
 *
 * The functions are rebound below so we can create this abstract solution for handling items.
 * Makes it nice and neat and keeps all the underlying code elsewhere.
 */

export class InventoryView {
    /**
     * Add an inventory item rule.
     * Rules are for anything that has to do with moving items.
     * @static
     * @param {INVENTORY_RULES} rule
     * @param {(item: Item, selectedSlot: number, endSlot: number) => boolean} callback
     * @return {boolean}
     * @memberof InventoryView
     */
    static addRule(
        rule: INVENTORY_RULES,
        callback: (player: alt.Player, item: Item, selectedSlot: number, endSlot: number, rule: string) => boolean,
    ): boolean {
        if (!ITEM_RULES[rule]) {
            return false;
        }

        ITEM_RULES[rule].push(callback);
        return true;
    }

    /**
     * Verify all inventory rules.
     * @static
     * @param {INVENTORY_RULES} rule
     * @param {Item} item
     * @param {number} selectedSlot
     * @param {number} endSlot
     * @return {Promise<boolean>}
     * @memberof InventoryView
     */
    static async verifyRules(
        player: alt.Player,
        rule: INVENTORY_RULES,
        item: Item,
        selectedSlot: number,
        endSlot: number,
    ): Promise<boolean> {
        if (ITEM_RULES[rule].length <= 0) {
            return true;
        }

        for (let i = 0; i < ITEM_RULES[rule].length; i++) {
            const didPass = await ITEM_RULES[rule][i](player, item, selectedSlot, endSlot, rule);
            if (didPass) {
                continue;
            }

            return false;
        }

        return true;
    }

    /**
     * Returns the rules to check against for selected / end data.
     * @static
     * @param {CategoryData} selectData
     * @param {CategoryData} endData
     * @return {({ selected: INVENTORY_RULES; end: INVENTORY_RULES } | null)}
     * @memberof InventoryView
     */
    static getInventoryRule(
        selectData: CategoryData,
        endData: CategoryData,
    ): { selected: INVENTORY_RULES; end: INVENTORY_RULES } | null {
        // Inventory Rules
        if (selectData.abbrv.includes(SLOT_TYPE.INVENTORY) && endData.abbrv.includes(SLOT_TYPE.TOOLBAR)) {
            return {
                selected: INVENTORY_RULES.FROM_INVENTORY_TO_TOOLBAR,
                end: INVENTORY_RULES.FROM_TOOLBAR_TO_INVENTORY,
            };
        }

        if (selectData.abbrv.includes(SLOT_TYPE.INVENTORY) && endData.abbrv.includes(SLOT_TYPE.EQUIPMENT)) {
            return {
                selected: INVENTORY_RULES.FROM_INVENTORY_TO_EQUIPMENT,
                end: INVENTORY_RULES.FROM_EQUIPMENT_TO_INVENTORY,
            };
        }

        // Equipment Rules
        if (selectData.abbrv.includes(SLOT_TYPE.EQUIPMENT) && endData.abbrv.includes(SLOT_TYPE.INVENTORY)) {
            return {
                selected: INVENTORY_RULES.FROM_EQUIPMENT_TO_INVENTORY,
                end: INVENTORY_RULES.FROM_INVENTORY_TO_EQUIPMENT,
            };
        }

        if (selectData.abbrv.includes(SLOT_TYPE.EQUIPMENT) && endData.abbrv.includes(SLOT_TYPE.TOOLBAR)) {
            return {
                selected: INVENTORY_RULES.FROM_EQUIPMENT_TO_TOOLBAR,
                end: INVENTORY_RULES.FROM_TOOLBAR_TO_EQUIPMENT,
            };
        }

        // Toolbar Rules
        if (selectData.abbrv.includes(SLOT_TYPE.TOOLBAR) && endData.abbrv.includes(SLOT_TYPE.INVENTORY)) {
            return {
                selected: INVENTORY_RULES.FROM_TOOLBAR_TO_INVENTORY,
                end: INVENTORY_RULES.FROM_INVENTORY_TO_TOOLBAR,
            };
        }

        if (selectData.abbrv.includes(SLOT_TYPE.TOOLBAR) && endData.abbrv.includes(SLOT_TYPE.EQUIPMENT)) {
            return {
                selected: INVENTORY_RULES.FROM_TOOLBAR_TO_EQUIPMENT,
                end: INVENTORY_RULES.FROM_EQUIPMENT_TO_TOOLBAR,
            };
        }

        return null;
    }

    /**
     * Used when a player is moving one item from one space to another, equipping, etc.
     * @static
     * @param {alt.Player} player
     * @param {string} selectedSlot
     * @param {string} endSlot
     * @param {(string | null)} hash
     * @return {*}  {void}
     * @memberof InventoryView
     */
    static async processItemMovement(
        player: alt.Player,
        selectedSlot: string,
        endSlot: string,
        hash: string | null,
    ): Promise<void> {
        if (!player || !player.valid || !player.data) {
            return;
        }

        // Do nothing. They're placing it in the same slot.
        if (selectedSlot === endSlot) {
            playerConst.sync.inventory(player);
            return;
        }

        // The data locations on `player.data` we are using.
        const endData = DataHelpers.find((dataInfo) => endSlot.includes(dataInfo.abbrv));
        const endSlotIndex = stripCategory(endSlot);

        // This is just an array of function(s) that can be called.
        // The data abbreviation is used to determine what functions should be called.
        // Removes a lot of unnecessary duplicate code.
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));

        // If the item is being removed from the toolbar.
        // Remove current weapons which are on the player.
        if (selectData.name === INVENTORY_TYPE.TOOLBAR && endData.name !== INVENTORY_TYPE.TOOLBAR) {
            player.removeAllWeapons();
        }

        // Handle Drop Ground
        // Implies that an item is being dropped on the ground.
        if (endData.name === INVENTORY_TYPE.GROUND) {
            InventoryView.handleDropGround(player, selectedSlot);
            return;
        }

        // Pickup Item from Ground
        // Implies that an item is being picked up from the ground.
        if (selectData.name === INVENTORY_TYPE.GROUND) {
            InventoryView.handlePickupGround(player, endData, endSlotIndex, hash);
            return;
        }

        const selectSlotIndex = stripCategory(selectedSlot);
        const itemClone: Item = selectData.getItem(player, selectSlotIndex);

        if (!itemClone) {
            playerConst.sync.inventory(player);
            return;
        }

        // Only run rules on different inventory, equipment, etc. movements.
        // Will never run rules on inventory to inventory movement.
        if (selectData.abbrv !== endData.abbrv) {
            const rules = InventoryView.getInventoryRule(selectData, endData);
            const selectedResult = await InventoryView.verifyRules(
                player,
                rules.selected,
                itemClone,
                selectSlotIndex,
                endSlotIndex,
            );

            if (!selectedResult) {
                playerConst.sync.inventory(player);
                return;
            }
        }

        // Check if this is a swap or stack.
        // Automatically handles all inventory types...
        // Including equipment, toolbar, and inventory.
        // This will automatically save the player inventory and synchronize it.
        if (endData.emptyCheck && !endData.emptyCheck(player, endSlotIndex)) {
            // End Data Swaps
            if (selectData.abbrv !== endData.abbrv) {
                const endItemClone: Item = endData.getItem(player, endSlotIndex);
                const rules = InventoryView.getInventoryRule(selectData, endData);
                const selectedResult = await InventoryView.verifyRules(
                    player,
                    rules.selected,
                    endItemClone,
                    endSlotIndex,
                    selectSlotIndex,
                );

                if (!selectedResult) {
                    playerConst.sync.inventory(player);
                    return;
                }
            }

            playerConst.inventory.handleSwapOrStack(player, selectedSlot, endSlot);
            return;
        }

        // Before doing anything it checks that the item move is valid.
        // Example(s) being:
        // Can the item be dropped.
        // Can the item be equipped as equipment.
        // Can the item be moved to the Toolbar.
        if (!playerConst.inventory.allItemRulesValid(itemClone, endData, endSlotIndex)) {
            playerConst.sync.inventory(player);
            return;
        }

        const isEquipmentItem = isFlagEnabled(itemClone.behavior, ITEM_TYPE.IS_EQUIPMENT);
        if (isEquipmentItem && itemClone.data.sex !== player.data.appearance.sex) {
            playerConst.sync.inventory(player);
            return;
        }

        const didRemoveItem = selectData.removeItem(player, itemClone.slot);
        if (!didRemoveItem) {
            playerConst.sync.inventory(player);
            return;
        }

        const didAddItem = endData.addItem(player, itemClone, endSlotIndex);
        if (!didAddItem) {
            playerConst.sync.inventory(player);
            return;
        }

        stateConst.setBulk(
            player,
            { [selectData.name]: player.data[selectData.name], [endData.name]: player.data[endData.name] },
            true,
        );

        playerConst.sync.inventory(player);
        playerConst.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    /**
     * Propogates the item to appear on the ground.
     * @static
     * @param {string} selectedSlot
     * @memberof InventoryView
     */
    static async handleDropGround(player: alt.Player, selectedSlot: string) {
        const selectSlotIndex = stripCategory(selectedSlot);
        const selectData = DataHelpers.find((dataInfo) => selectedSlot.includes(dataInfo.abbrv));

        if (selectData.name === INVENTORY_TYPE.GROUND) {
            playerConst.sync.inventory(player);
            return;
        }

        const itemClone: Item = selectData.getItem(player, selectSlotIndex);

        if (player.vehicle) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!itemClone) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!isFlagEnabled(itemClone.behavior, ITEM_TYPE.CAN_DROP)) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!playerConst.inventory.allItemRulesValid(itemClone, { name: 'ground' }, null)) {
            playerConst.sync.inventory(player);
            return;
        }

        let dataType: INVENTORY_RULES;

        if (selectData.abbrv.includes(SLOT_TYPE.INVENTORY)) {
            dataType = INVENTORY_RULES.FROM_INVENTORY_TO_GROUND;
        } else if (selectData.abbrv.includes(SLOT_TYPE.EQUIPMENT)) {
            dataType = INVENTORY_RULES.FROM_EQUIPMENT_TO_GROUND;
        } else if (selectData.abbrv.includes(SLOT_TYPE.TOOLBAR)) {
            dataType = INVENTORY_RULES.FROM_TOOLBAR_TO_GROUND;
        }

        if (dataType) {
            const result = await InventoryView.verifyRules(player, dataType, itemClone, selectSlotIndex, -1);
            if (!result) {
                playerConst.sync.inventory(player);
                return;
            }
        }

        const didRemoveItem = selectData.removeItem(player, itemClone.slot);
        if (!didRemoveItem) {
            playerConst.sync.inventory(player);
            return;
        }

        stateConst.set(player, selectData.name, player.data[selectData.name], true);
        playerConst.sync.inventory(player);
        playerConst.emit.sound2D(player, 'item_drop_1', Math.random() * 0.45 + 0.1);

        // Destroys an item when it is dropped on the ground if the behavior calls for it.
        if (isFlagEnabled(itemClone.behavior, ITEM_TYPE.DESTROY_ON_DROP)) {
            playerConst.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
            playerConst.emit.message(
                player,
                LocaleController.get(LOCALE_KEYS.ITEM_WAS_DESTROYED_ON_DROP, itemClone.name),
            );
            return;
        }

        itemClone.hash = sha256Random(JSON.stringify(itemClone));

        const frontPosition = playerConst.utility.getPositionFrontOf(player, 0.5);
        const groundPos = { x: frontPosition.x, y: frontPosition.y, z: player.pos.z - 1 };
        const itemInfoPos = { x: frontPosition.x, y: frontPosition.y, z: player.pos.z - 0.3 };

        const droppedItem = {
            gridSpace: player.gridSpace,
            item: itemClone,
            position: itemInfoPos,
            dimension: player.dimension,
        };

        GROUND_ITEMS.push(droppedItem);
        ServerItemController.append({
            item: droppedItem,
            uid: itemClone.hash,
            maxDistance: 10,
            pos: itemInfoPos,
        });

        const objectModel = itemClone.model ? itemClone.model : 'prop_cs_box_clothes';
        ServerObjectController.append({
            pos: groundPos,
            uid: itemClone.hash,
            maxDistance: 10,
            model: objectModel,
            dimension: player.dimension,
            noCollision: true,
        });

        playerConst.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);
        PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.DROPPED_ITEM, player, itemClone);
    }

    static getDroppedItemsByGridSpace(dimension: number, gridSpace: number): Array<DroppedItem> {
        return GROUND_ITEMS.filter((item) => item.gridSpace === gridSpace && item.dimension === dimension);
    }

    static handleProcessPickup(player: alt.Player, hash: string) {
        const openSlot = playerConst.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            playerConst.sync.inventory(player);
            return;
        }

        const endData = DataHelpers.find((dataInfo) => 'i-'.includes(dataInfo.abbrv));
        if (!endData) {
            playerConst.sync.inventory(player);
            return;
        }

        InventoryView.handlePickupGround(player, endData, openSlot.slot, hash);
    }

    static async handlePickupGround(
        player: alt.Player,
        endData: CategoryData,
        endSlotIndex: number,
        hash: string | null,
    ) {
        if (player.vehicle) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!endData.emptyCheck(player, endSlotIndex)) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!hash) {
            playerConst.sync.inventory(player);
            return;
        }

        const index = GROUND_ITEMS.findIndex((gItem) => gItem.item.hash === hash);
        if (index <= -1) {
            playerConst.sync.inventory(player);
            return;
        }

        const droppedItem: DroppedItem = { ...GROUND_ITEMS[index] };
        if (distance2d(player.pos, droppedItem.position) >= 10) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!playerConst.inventory.allItemRulesValid(droppedItem.item, endData, endSlotIndex)) {
            playerConst.sync.inventory(player);
            return;
        }

        let dataType: INVENTORY_RULES;

        if (endData.abbrv.includes(SLOT_TYPE.INVENTORY)) {
            dataType = INVENTORY_RULES.FROM_GROUND_TO_INVENTORY;
        } else if (endData.abbrv.includes(SLOT_TYPE.GROUND)) {
            dataType = INVENTORY_RULES.FROM_GROUND_TO_EQUIPMENT;
        } else if (endData.abbrv.includes(SLOT_TYPE.TOOLBAR)) {
            dataType = INVENTORY_RULES.FROM_GROUND_TO_TOOLBAR;
        }

        if (dataType) {
            const result = await InventoryView.verifyRules(
                player,
                dataType,
                droppedItem.item,
                droppedItem.gridSpace,
                -1,
            );
            if (!result) {
                playerConst.sync.inventory(player);
                return;
            }
        }

        const isEquipmentItem = isFlagEnabled(droppedItem.item.behavior, ITEM_TYPE.IS_EQUIPMENT);
        const isGoingToEquipment = endData.name === INVENTORY_TYPE.EQUIPMENT;
        if (isEquipmentItem && isGoingToEquipment && droppedItem.item.data.sex !== player.data.appearance.sex) {
            playerConst.sync.inventory(player);
            // this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }

        const removedItems = GROUND_ITEMS.splice(index, 1);
        if (removedItems.length <= 0) {
            playerConst.sync.inventory(player);
            // this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }

        const didAddItem = endData.addItem(player, droppedItem.item, endSlotIndex);
        if (!didAddItem) {
            playerConst.sync.inventory(player);
            // this.updateDroppedItemsAroundPlayer(player, false);
            return;
        }

        stateConst.set(player, endData.name, player.data[endData.name], true);
        playerConst.sync.inventory(player);
        playerConst.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
        playerConst.emit.animation(player, 'random@mugging4', 'pickup_low', 33, 1200);

        ServerObjectController.remove(hash);
        ServerItemController.remove(hash);
    }

    /**
     * Called when a player right-clicks an item.
     * @static
     * @param {alt.Player} player
     * @param {string} selectedSlot // i-0
     * @return {*}
     * @memberof InventoryView
     */
    static processUse(player: alt.Player, selectedSlot: string) {
        if (!selectedSlot) {
            playerConst.sync.inventory(player);
            return;
        }

        const slot = stripCategory(selectedSlot);
        if (isNaN(slot)) {
            playerConst.sync.inventory(player);
            return;
        }

        const slotType = playerConst.inventory.getSlotType(selectedSlot);
        const originalItem = player.data[slotType].find((i) => i && i.slot === slot);

        if (!originalItem) {
            playerConst.sync.inventory(player);
            return;
        }

        const item = deepCloneObject(originalItem) as Item;
        if (item.equipment !== undefined && item.equipment !== null) {
            if (selectedSlot.includes('t-')) {
                playerConst.sync.inventory(player);
                return;
            }

            if (selectedSlot.includes('e-')) {
                // Unequip
                const openSlot = playerConst.inventory.getFreeInventorySlot(player);
                if (!openSlot) {
                    playerConst.sync.inventory(player);
                    return;
                }

                if (!playerConst.inventory.equipmentRemove(player, item.equipment)) {
                    playerConst.sync.inventory(player);
                    return;
                }

                playerConst.inventory.inventoryAdd(player, item, openSlot.slot);
            } else {
                // Equip
                // Remove item from inventory.
                if (!playerConst.inventory.inventoryRemove(player, item.slot)) {
                    playerConst.sync.inventory(player);
                    return;
                }

                let removedItem: Item;

                // Check if the equipment slot is taken
                const targetSlotIndex = player.data.equipment.findIndex((i) => i && i.equipment === item.equipment);
                if (targetSlotIndex >= 0) {
                    removedItem = deepCloneObject(player.data.equipment[targetSlotIndex]);
                    if (!playerConst.inventory.equipmentRemove(player, item.equipment)) {
                        playerConst.sync.inventory(player);
                        return;
                    }

                    // Add old item to inventory from equipment
                    playerConst.inventory.inventoryAdd(player, removedItem, item.slot);
                }

                playerConst.inventory.equipmentAdd(player, item, item.equipment);
            }

            stateConst.setBulk(player, { equipment: player.data.equipment, inventory: player.data.inventory });
            playerConst.sync.inventory(player);
            return;
        }

        if (!isFlagEnabled(item.behavior, ITEM_TYPE.CONSUMABLE)) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!isFlagEnabled(item.behavior, ITEM_TYPE.SKIP_CONSUMABLE)) {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                playerConst.inventory.inventoryRemove(player, slot);
            } else {
                playerConst.inventory.replaceInventoryItem(player, item);
            }

            stateConst.set(player, INVENTORY_TYPE.INVENTORY, player.data.inventory, true);
            playerConst.sync.inventory(player);
        }

        if (item.data && item.data.event) {
            ItemEffects.invoke(player, item, INVENTORY_TYPE.INVENTORY);
            playerConst.emit.sound2D(player, 'item_use', Math.random() * 0.45 + 0.1);
        }
    }

    static processSplit(player: alt.Player, selectedSlot: string, amount: number) {
        if (isNaN(amount)) {
            playerConst.sync.inventory(player);
            return;
        }

        if (amount <= 0) {
            playerConst.sync.inventory(player);
            return;
        }

        if (!selectedSlot.includes('i-')) {
            playerConst.sync.inventory(player);
            return;
        }

        const currentSlotValue = stripCategory(selectedSlot);
        const index = player.data.inventory.findIndex((i) => i && i.slot === currentSlotValue);

        if (index <= -1) {
            playerConst.sync.inventory(player);
            return;
        }

        const inventorySlot = playerConst.inventory.getFreeInventorySlot(player);
        if (!inventorySlot) {
            playerConst.sync.inventory(player);
            return;
        }

        const clonedItem = deepCloneObject(player.data.inventory[index]) as Item;
        if (clonedItem.quantity < amount) {
            playerConst.sync.inventory(player);
            return;
        }

        if (amount >= clonedItem.quantity) {
            playerConst.sync.inventory(player);
            return;
        }

        player.data.inventory[index].quantity -= amount;
        clonedItem.quantity = amount;
        playerConst.inventory.inventoryAdd(player, clonedItem, inventorySlot.slot);

        stateConst.set(player, INVENTORY_TYPE.INVENTORY, player.data.inventory, true);
        playerConst.sync.inventory(player);
    }
}

const DataHelpers: Array<CategoryData> = [
    {
        abbrv: SLOT_TYPE.INVENTORY,
        name: INVENTORY_TYPE.INVENTORY,
        emptyCheck: playerConst.inventory.isInventorySlotFree,
        getItem: playerConst.inventory.getInventoryItem,
        removeItem: playerConst.inventory.inventoryRemove,
        addItem: playerConst.inventory.inventoryAdd,
    },
    {
        abbrv: SLOT_TYPE.TOOLBAR,
        name: INVENTORY_TYPE.TOOLBAR,
        emptyCheck: playerConst.inventory.isToolbarSlotFree,
        getItem: playerConst.inventory.getToolbarItem,
        removeItem: playerConst.inventory.toolbarRemove,
        addItem: playerConst.inventory.toolbarAdd,
    },
    {
        abbrv: SLOT_TYPE.EQUIPMENT,
        name: INVENTORY_TYPE.EQUIPMENT,
        emptyCheck: playerConst.inventory.isEquipmentSlotFree,
        getItem: playerConst.inventory.getEquipmentItem,
        removeItem: playerConst.inventory.equipmentRemove,
        addItem: playerConst.inventory.equipmentAdd,
    },
    {
        abbrv: SLOT_TYPE.GROUND,
        name: INVENTORY_TYPE.GROUND,
        emptyCheck: null,
        getItem: null,
        removeItem: null,
        addItem: null,
    },
];

/**
 * @deprecated Use {@link InventoryView}
 */
export const InventoryController = InventoryView;

alt.onClient(View_Events_Inventory.Use, InventoryView.processUse);
alt.onClient(View_Events_Inventory.Process, InventoryView.processItemMovement);
alt.onClient(View_Events_Inventory.Split, InventoryView.processSplit);
alt.onClient(View_Events_Inventory.Pickup, InventoryView.handleProcessPickup);
