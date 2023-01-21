import * as alt from 'alt-server';

import { StoredItem } from '@AthenaShared/interfaces/item';
import { documentsConst } from '@AthenaServer/api/consts/constDocuments';
import { ItemManager } from '@AthenaServer/systems/itemManager';
import { ItemFactory } from '@AthenaServer/systems/itemFactory';

const Inventory = {
    /**
     * Add a new stored item to a user, must specify a quantity of greater than zero.
     * Automatically checks weight upon new item additions. Exceeding the weight; cancels the add.
     * Does not look into toolbar.
     *
     * @param {alt.Player} player
     * @param {Omit<StoredItem, 'slot'>} item
     * @return {Promise<boolean>}
     */
    async add(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean> {
        const data = documentsConst.character.get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        const baseItem = ItemFactory.sync.getBaseItem(item.dbName, item.version);
        if (typeof baseItem === 'undefined') {
            return false;
        }

        if (typeof data.inventory === 'undefined') {
            data.inventory = [];
        }

        item.data = Object.assign(baseItem.data, item.data);
        const newInventoryData = ItemManager.inventory.add(item, data.inventory, 'inventory');
        if (typeof newInventoryData === 'undefined') {
            return false;
        }

        if (ItemManager.inventory.isWeightExceeded([newInventoryData, data.toolbar])) {
            return false;
        }

        await documentsConst.character.set(player, 'inventory', newInventoryData);
        return true;
    },
    /**
     * Subtract a quantity of an item from a player's inventory.
     * Does not look into toolbar.
     *
     * @param {alt.Player} player
     * @param {Omit<StoredItem, 'slot'>} item
     * @return {Promise<boolean>}
     */
    async sub(player: alt.Player, item: Omit<StoredItem, 'slot'>): Promise<boolean> {
        const data = documentsConst.character.get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        if (typeof data.inventory === 'undefined') {
            return false;
        }

        const newInventoryData = ItemManager.inventory.sub(item, data.inventory);
        if (typeof newInventoryData === 'undefined') {
            return false;
        }

        await documentsConst.character.set(player, 'inventory', newInventoryData);
        return true;
    },
    /**
     * Delete an item in a specific slot in an inventory data set.
     * Does not look into toolbar.
     *
     * @param {alt.Player} player
     * @param {number} slot
     * @return {Promise<boolean>}
     */
    async delete(player: alt.Player, slot: number): Promise<boolean> {
        const data = documentsConst.character.get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        if (typeof data.inventory === 'undefined') {
            return false;
        }

        const newInventoryData = ItemManager.slot.removeAt(slot, data.inventory);
        if (typeof newInventoryData === 'undefined') {
            return false;
        }

        await documentsConst.character.set(player, 'inventory', newInventoryData);
        return true;
    },
};

/**
 * It allows you to override any function in the inventory module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Inventory>(functionName: Key, callback: typeof Inventory[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.inventory does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

export const funcs: typeof Inventory & { override?: typeof override } = {
    ...Inventory,
    override,
};

export default funcs;
