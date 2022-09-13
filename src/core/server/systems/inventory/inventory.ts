import * as alt from 'alt-server';
import { CharacterInventory, Item, ItemSlot, StoredItem } from '../../../shared/interfaces/inventory';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { Athena } from '../../api/athena';
import { StateManager } from '../stateManager';
import ItemFactory from './factory';
import Shared from './shared';

/**
 * Recursively adds items until the stack size is zero or there is no more room in the player's inventory.
 * If there is a left-over amount of items it will return the remaining amount. It may also return zero.
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {Item} item
 * @param {boolean} stack
 * @param {number} [maxSlotCount=27]
 * @return {Promise<number>}
 */
async function add(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    item: Item,
    stack: boolean,
    maxSlotCount = 27, // Actually technically 28
): Promise<number> {
    if (typeof player.data.inventory === 'undefined') {
        player.data.inventory = [];
    }

    // Check if the base item exists in the Database
    const baseItem = await ItemFactory.getByName(item.base);
    if (typeof baseItem === 'undefined') {
        return item.quantity;
    }

    const itemRef = deepCloneObject<Item<StoredItem>>(item);
    const items = [...player.data.inventory] as Array<Item<StoredItem>>;

    // Recursively adds items, until no more room left, or item stack equals zero.
    if (!stack) {
        const slot = Shared.findAvailableSlot(player, 'inventory', maxSlotCount);
        if (typeof slot === 'undefined') {
            return itemRef.quantity;
        }

        let remainingToStack = 0;

        if (baseItem.stack < itemRef.quantity) {
            remainingToStack = Math.abs(baseItem.stack - itemRef.quantity);
            if (remainingToStack >= 1) {
                itemRef.quantity -= remainingToStack;
            }
        }

        // ! - TODO - Auto-Weight Calculation

        items.push(itemRef);
        await StateManager.set(player, 'inventory', items);
        Athena.player.sync.inventory(player as alt.Player);

        if (remainingToStack >= 1) {
            const newItemRef = deepCloneObject<Item>(item);
            newItemRef.quantity = remainingToStack;
            return add(player, newItemRef, false, maxSlotCount);
        }

        return 0;
    }

    // Handle Stacking recursively
    const itemIndex = items.findIndex((item) => {
        // Check if the base item matches.
        if (item.base !== baseItem.base) {
            return false;
        }

        // Check if item is not fully stacked.
        if (item.quantity === baseItem.stack) {
            return false;
        }

        return true;
    });

    // The item does not currently exist
    // in the inventory with an incomplete stack size.
    if (itemIndex <= -1) {
        const slot = Shared.findAvailableSlot(player, 'inventory', maxSlotCount);
        if (typeof slot === 'undefined') {
            return itemRef.quantity;
        }

        return add(player, itemRef, false, maxSlotCount);
    }

    // Handle stacking logic here we found a item that does not have max stack count.
    const howMuchToAdd = Math.abs(baseItem.stack - items[itemIndex].quantity);
    items[itemIndex].quantity += howMuchToAdd;

    // ! - TODO - Auto-Weight Calculation

    await StateManager.set(player, 'inventory', items);
    Athena.player.sync.inventory(player as alt.Player);

    const amountRemainingToStack = itemRef.quantity - howMuchToAdd;
    if (amountRemainingToStack >= 1) {
        itemRef.quantity = amountRemainingToStack;
        return add(player, itemRef, true, maxSlotCount);
    }

    return 0;
}

/**
 * Goes through the items and tries to remove as many items as possible.
 * If strict is set to true, it will ensure there is the exact amount of items before removal.
 * Returns the quantity that did not get removed from the inventory.
 * Zero means all valid items were removed.
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {string} baseName
 * @param {number} quantityToRemove
 * @param {boolean} strict
 * @return {Promise<number>}
 */
async function sub(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    baseName: string,
    quantityToRemove: number,
    strict: boolean,
): Promise<number> {
    if (typeof player.data.inventory === 'undefined') {
        player.data.inventory = [];
        return quantityToRemove;
    }

    const items = [...player.data.inventory] as Array<Item<StoredItem>>;

    // Strict means it must have this amount to remove it.
    if (strict) {
        let totalAmount = 0;
        for (let item of items) {
            if (item.base !== baseName) {
                continue;
            }

            totalAmount += item.quantity;
        }

        // Return the amount that we did not remove.
        if (totalAmount < quantityToRemove) {
            return quantityToRemove;
        }
    }

    for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].base !== baseName) {
            continue;
        }

        if (quantityToRemove <= 0) {
            break;
        }

        // If it is the exact quantity do a simple removal.
        if (items[i].quantity === quantityToRemove) {
            items.splice(i, 1);
            await StateManager.set(player, 'inventory', items);
            Athena.player.sync.inventory(player as alt.Player);
            return 0;
        }

        // Removing large quantity, but still need to remove more...
        if (items[i].quantity < quantityToRemove) {
            quantityToRemove -= items[i].quantity;
            items.splice(i, 1);
            continue;
        }

        // The item has a greater quantity than what we want to remove.
        items[i].quantity -= quantityToRemove;
        // ! - TODO - Auto-Weight Calculation
        break;
    }

    await StateManager.set(player, 'inventory', items);
    Athena.player.sync.inventory(player as alt.Player);
    return quantityToRemove;
}

/**
 * Fully removes an item from an inventory slot. Does not handle quantity.
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {number} slot
 * @return {Promise<boolean>}
 */
async function remove<T = StoredItem>(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    slot: number,
): Promise<Item<T> | false> {
    if (typeof player.data.inventory === 'undefined') {
        player.data.inventory = [];
        return false;
    }

    const items = [...player.data.inventory] as Array<Item<T>>;
    const index = items.findIndex((item) => item && item.slot === slot);
    if (index <= -1) {
        return false;
    }

    const item = deepCloneObject<Item<T>>(items.splice(index, 1));
    await StateManager.set(player, 'inventory', items);
    Athena.player.sync.inventory(player as alt.Player);
    return item;
}

/**
 * Check if inventory item at a slot has a specific set of data keys.
 *
 * @template T
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {number} slot
 * @param {Array<string>} keys
 * @return {boolean}
 */
function hasDataKeys<T = StoredItem>(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    slot: number,
    keys: Array<string>,
): boolean {
    if (typeof player.data.inventory === 'undefined') {
        player.data.inventory = [];
        return false;
    }

    const items = [...player.data.inventory] as Array<Item<T>>;
    const index = items.findIndex((item) => item && item.slot === slot);
    if (index <= -1) {
        return false;
    }

    for (let key of keys) {
        if (typeof items[index].data[key] === 'undefined') {
            return false;
        }
    }

    return true;
}

const Inventory = {
    add,
    hasDataKeys,
    sub,
    remove,
};

function override<Key extends keyof typeof Inventory>(functionName: Key, callback: typeof Inventory[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        return;
    }

    exports[functionName] = callback;
}

const exports: typeof Inventory & { override?: typeof override } = {
    ...Inventory,
    override,
};

export default exports;
