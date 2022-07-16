import * as alt from 'alt-server';
import { Item } from '../../shared/interfaces/item';
import { Athena } from '../api/athena';
import { ItemFactory } from './item';

type validSearchTypes = 'equipment' | 'toolbar' | 'inventory';

/**
 * A simple wrapper for easier inventory management.
 *
 * Taps into existing playerFuncs.
 *
 * @export
 * @class SimpleInventory
 */
export class SimpleInventory {
    /**
     * Return the player.data.$type array index.
     *
     * @static
     * @param {alt.Player} player
     * @param {validSearchTypes} type
     * @param {string} itemName
     * @return {number}
     * @memberof SimpleInventory
     */
    static getItemIndex(player: alt.Player, type: validSearchTypes, itemName: string): number {
        if (!player || !player.valid) {
            return -1;
        }

        if (!player.data[type]) {
            return -1;
        }

        for (let i = player.data.inventory.length - 1; i >= 0; i--) {
            if (!player.data[type][i] || !player.data[type][i].name.toLowerCase().includes(itemName.toLowerCase())) {
                continue;
            }

            return i;
        }

        return -1;
    }

    /**
     * Returns player.data.$type as an item;
     *
     * @static
     * @param {alt.Player} player
     * @param {validSearchTypes} type
     * @param {string} itemName
     * @return {(Item | undefined)}
     * @memberof SimpleInventory
     */
    static getItem(player: alt.Player, type: validSearchTypes, itemName: string): Item | undefined {
        const index = SimpleInventory.getItemIndex(player, type, itemName);
        if (index <= -1) {
            return undefined;
        }

        if (!player.data[type]) {
            return undefined;
        }

        return player.data[type][index] as Item;
    }

    /**
     * Simply adds an item to the inventory.
     *
     * -> Does not check for existing stacks.
     * -> Automatically enforces max stack size.
     * -> Automatically ensures quantity is at least 1.
     * -> Saves to Database
     *
     * Returns true if successfully added.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} itemName
     * @param {number} [quantity=1]
     * @return {Promise<boolean>}
     * @memberof SimpleInventory
     */
    static async addItemByName(player: alt.Player, itemName: string, quantity: number = 1): Promise<boolean> {
        const itemRef = await ItemFactory.get(itemName);
        if (!itemRef) {
            alt.logWarning(`${itemName} is not a valid item to add to a player.`);
            return false;
        }

        if (quantity <= 0) {
            return false;
        }

        if (typeof itemRef.maxStack === 'number' && quantity > itemRef.maxStack) {
            quantity = itemRef.maxStack;
            if (quantity <= 0) {
                quantity = 1;
            }
        }

        const freeSlot = Athena.player.inventory.getFreeInventorySlot(player);
        if (!freeSlot) {
            Athena.player.emit.notification(player, `No space in inventory for ${itemName}`);
            return false;
        }

        itemRef.quantity = quantity;
        Athena.player.inventory.inventoryAdd(player, itemRef, freeSlot.slot);
        await Athena.state.set(player, 'inventory', player.data.inventory, true);
        return true;
    }
}
