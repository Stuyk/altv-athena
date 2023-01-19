import * as alt from 'alt-server';

import { StoredItem } from '@AthenaShared/interfaces/item';
import { documentsConst } from '@AthenaServer/api/consts/constDocuments';
import { ItemManager } from '@AthenaServer/systems/itemManager';
import { ItemFactory } from '@AthenaServer/systems/itemFactory';

const Toolbar = {
    /**
     * Add a new stored item to a user, must specify a quantity of greater than zero.
     * Toolbar only.
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

        if (typeof data.toolbar === 'undefined') {
            data.toolbar = [];
        }

        const newToolbarData = ItemManager.inventory.add(item, data.toolbar, 'toolbar');
        if (typeof newToolbarData === 'undefined') {
            return false;
        }

        await documentsConst.character.set(player, 'toolbar', newToolbarData);
        return true;
    },
    /**
     * Subtract a quantity of an item from a player's toolbar.
     * Toolbar only.
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

        if (typeof data.toolbar === 'undefined') {
            return false;
        }

        const newToolbarData = ItemManager.inventory.sub(item, data.toolbar);
        if (typeof newToolbarData === 'undefined') {
            return false;
        }

        await documentsConst.character.set(player, 'toolbar', newToolbarData);
        return true;
    },
    /**
     * Delete an item in a specific slot in an toolbar data set.
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

        if (typeof data.toolbar === 'undefined') {
            return false;
        }

        const newToolbarData = ItemManager.slot.removeAt(slot, data.toolbar);
        if (typeof newToolbarData === 'undefined') {
            return false;
        }

        await documentsConst.character.set(player, 'toolbar', newToolbarData);
        return true;
    },
};

/**
 * It allows you to override any function in the inventory module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Toolbar>(functionName: Key, callback: typeof Toolbar[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.toolbar does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

export const funcs: typeof Toolbar & { override?: typeof override } = {
    ...Toolbar,
    override,
};

export default funcs;
