import * as alt from 'alt-server';
import { EQUIPMENT_TYPE } from '../../../shared/enums/equipmentType';
import { CharacterInventory, Item } from '../../../shared/interfaces/inventory';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { Athena } from '../../api/athena';
import { StateManager } from '../stateManager';
import Inventory from './inventory';

async function equip(player: CharacterInventory | Pick<alt.Player, 'data'>, inventorySlot: number): Promise<boolean> {
    if (typeof player.data.inventory === 'undefined') {
        player.data.inventory = [];
        return false;
    }

    const removedItem = await Inventory.remove<{ slot: EQUIPMENT_TYPE }>(player, inventorySlot);
    if (typeof removedItem === 'boolean' && removedItem === false) {
        return false;
    }

    // Check if there is already an equipment slot taken
    // If there is a slot taken...
    //      Remove the item from the equipment slot
    //      Then take the removed item and add it in place of that slot
    const removedEquipmentItem = await unequip(player, removedItem.data.slot);
    if (typeof removedEquipmentItem !== 'boolean' && typeof removedEquipmentItem !== 'undefined') {
        await Inventory.add(player, removedEquipmentItem, false);
    }

    const equipmentItems = [...player.data.equipment] as Array<Item<{ slot: EQUIPMENT_TYPE }>>;
    equipmentItems.push(removedItem);

    // Refresh / Synchronize the equipment / inventory
    // Save changes
    // Return the result
    await StateManager.set(player, 'equipment', equipmentItems);
    Athena.player.sync.inventory(player as alt.Player);
    return true;
}

/**
 * Unequips an item by 'slot' in the player's equipment
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {number} slot
 * @return {(Promise<Item<{ slot: EQUIPMENT_TYPE }> | false>)}
 */
async function unequip(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    slot: number,
): Promise<Item<{ slot: EQUIPMENT_TYPE }> | false> {
    if (typeof player.data.equipment === 'undefined') {
        player.data.equipment = [];
        return false;
    }

    const equipmentItems = [...player.data.equipment] as Array<Item<{ slot: EQUIPMENT_TYPE }>>;
    const index = equipmentItems.findIndex((item) => item && item.data.slot === slot);
    if (index <= -1) {
        return false;
    }

    const removedItem = deepCloneObject<Item<{ slot: EQUIPMENT_TYPE }>>(equipmentItems.splice(index, 1));
    await StateManager.set(player, 'equipment', equipmentItems);
    Athena.player.sync.inventory(player as alt.Player);
    return removedItem;
}

const Equipment = {
    equip,
    unequip,
};

function override<Key extends keyof typeof Equipment>(functionName: Key, callback: typeof Equipment[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        return;
    }

    exports[functionName] = callback;
}

const exports: typeof Equipment & { override?: typeof override } = {
    ...Equipment,
    override,
};
