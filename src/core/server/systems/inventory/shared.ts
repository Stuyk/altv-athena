import * as alt from 'alt-server';
import { CharacterInventory, Item, ItemSlot, StoredItem } from '../../../shared/interfaces/inventory';
import { StateManager } from '../stateManager';

/**
 * Used to find an item in a specific slot and return that item.
 *
 * @template T
 * @param {CharacterInventory<T>} player
 * @param {ItemSlot} type
 * @param {string} base
 * @return {(Item<T> | undefined)}
 */
function find<T = Object>(
    player: CharacterInventory<T> | Pick<alt.Player, 'data'>,
    type: ItemSlot,
    base: string,
): Item<T> | undefined {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return undefined;
    }

    const items = player.data[type] as Array<Item<T>>;
    for (let i = items.length - 1; i >= 0; i--) {
        if (typeof items[i] === 'undefined' || items[i] === null) {
            continue;
        }

        if (items[i].base.toLowerCase() !== base.toLowerCase()) {
            continue;
        }

        return items[i];
    }

    return undefined;
}

/**
 * Update but removes specified array of keys.
 *
 * @template Data
 * @param {CharacterInventory} player
 * @param {ItemSlot} type
 * @param {number} slot
 * @param {Array<string>} data
 */
async function updateData<Data = Object>(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    type: ItemSlot,
    slot: number,
    data: Array<string>,
);

/**
 * Update but it appends an object to the data property.
 * Combining the two objects together, and overriding existing fields.
 *
 * @template Data
 * @param {CharacterInventory} player
 * @param {ItemSlot} type
 * @param {number} slot
 * @param {Data} data
 * @return {Promise<boolean>}
 */
async function updateData<Data = Object>(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    type: ItemSlot,
    slot: number,
    data: Data,
): Promise<boolean> {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return false;
    }

    const items = player.data[type] as Array<Item<Data>>;
    for (let i = items.length - 1; i >= 0; i--) {
        if (typeof items[i] === 'undefined' || items[i] === null) {
            continue;
        }

        if (items[i].slot !== slot) {
            continue;
        }

        // For Appending / Combining
        if (typeof data === 'object') {
            items[i].data = Object.assign(items[i].data, data);
        }

        // For Removing Keys
        if (Array.isArray(data)) {
            for (const key of data) {
                delete items[i].data[key];
            }
        }

        await StateManager.set(player, type, items);
        return true;
    }

    return false;
}

/**
 * Update an inventory item based on slot.
 * Can only update specified StoredItem properties.
 * Good for updating quantity, weight, etc.
 *
 * @param {CharacterInventory} player
 * @param {ItemSlot} type
 * @param {number} slot
 * @param {Partial<StoredItem>} data
 * @return {Promise<boolean>}
 */
async function update(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    type: ItemSlot,
    slot: number,
    data: Partial<StoredItem>,
): Promise<boolean> {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return false;
    }

    const items = player.data[type] as Array<Item<StoredItem>>;
    for (let i = items.length - 1; i >= 0; i--) {
        if (typeof items[i] === 'undefined' || items[i] === null) {
            continue;
        }

        if (items[i].slot !== slot) {
            continue;
        }

        // ! - TODO -> CALCULATE WEIGHT BASED ON QUANTITY CHANGES
        // let oldQuantity = items[i].quantity;
        items[i] = Object.assign(items[i], data);

        // if (oldQuantity !== items[i].quantity) {
        //     items[i].weight = //
        // }

        await StateManager.set(player, type, items);
        return true;
    }

    return false;
}

/**
 * Count the total amount of the item base in a inventory type.
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {ItemSlot} type
 * @param {string} base
 * @return {number}
 */
function queryTotal(player: CharacterInventory | Pick<alt.Player, 'data'>, type: ItemSlot, base: string): number {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return 0;
    }

    let total = 0;
    const items = player.data[type] as Array<Item<StoredItem>>;
    for (let i = items.length - 1; i >= 0; i--) {
        if (typeof items[i] === 'undefined' || items[i] === null) {
            continue;
        }

        if (items[i].base !== base) {
            continue;
        }

        if (typeof items[i].quantity === 'undefined' || items[i].quantity === 0) {
            continue;
        }

        total += items[i].quantity;
    }

    return total;
}

/**
 * Look inside each item, look for specific data inside of data with a specific key and value pair.
 *
 * @param {(CharacterInventory | Pick<alt.Player, 'data'>)} player
 * @param {ItemSlot} type
 * @param {string} key
 * @param {any} value
 * @return {(Item | undefined)}
 */
function queryData(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    type: ItemSlot,
    key: string,
    value: any,
): Item | undefined {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return undefined;
    }

    const items = player.data[type] as Array<Item<StoredItem>>;
    for (let i = items.length - 1; i >= 0; i--) {
        if (typeof items[i] === 'undefined' || items[i] === null) {
            continue;
        }

        if (typeof items[i].data === 'undefined' || typeof items[i].data !== 'object') {
            continue;
        }

        let didFind = false;
        for (let internalKey of Object.keys(items[i].data)) {
            if (key !== internalKey) {
                continue;
            }

            if (items[i].data[key] !== value) {
                continue;
            }

            didFind = true;
            break;
        }

        if (!didFind) {
            continue;
        }

        return items[i];
    }

    return undefined;
}

/**
 * "Get the total weight of all items in a player's inventory."
 *
 * The function takes a single argument, which is either a CharacterInventory or an alt.Player. The
 * CharacterInventory is a custom type that I've defined, and it's used to store a player's inventory
 * in the database. The alt.Player is a type that's defined by the alt:V server
 * @param {CharacterInventory | Pick<alt.Player, 'data'>} player - CharacterInventory |
 * Pick<alt.Player, 'data'>
 * @returns The total weight of all items in the inventory.
 */
function getTotalWeight(player: CharacterInventory | Pick<alt.Player, 'data'>) {
    const types = ['inventory', 'equipment', 'toolbar'];

    let total = 0;
    for (let type of types) {
        if (typeof player.data[type] === 'undefined') {
            player.data[type] = [];
            continue;
        }

        const items = player.data[type] as Array<Item<StoredItem>>;
        for (let i = items.length - 1; i >= 0; i--) {
            if (typeof items[i] === 'undefined' || items[i] === null) {
                continue;
            }

            if (typeof items[i].weight !== 'number') {
                continue;
            }

            total += items[i].weight;
        }
    }

    return total;
}

function invokeEffect(player: CharacterInventory | Pick<alt.Player, 'data'>, type: ItemSlot, slot: number): boolean {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return false;
    }

    const items = player.data[type] as Array<Item<StoredItem>>;
    const index = items.findIndex((item) => item.slot === slot);
    if (index <= -1) {
        return false;
    }

    // ! TODO -> Fix Inventory Effects to Use New Types
    // ItemEffects.invoke(player as alt.Player, items[index], type as INVENTORY_TYPE)
    return true;
}

/**
 * Look into the inventory type. Loop through all index values of maxSlotCount and determine if that slot is already taken.
 * If it is not taken, return the slot number that is currently available.
 * Returns undefined if not slots are available. Use a typeof check to compare.
 *
 * @param {CharacterInventory | Pick<alt.Player, 'data'>} player - CharacterInventory |
 * Pick<alt.Player, 'data'>
 * @param {ItemSlot} type - ItemSlot - This is the type of item you're trying to add.
 * @param {number} maxSlotCount - number - The maximum amount of slots the player can have.
 * @returns {number | undefined}
 */
function findAvailableSlot(
    player: CharacterInventory | Pick<alt.Player, 'data'>,
    type: ItemSlot,
    maxSlotCount: number,
): number | undefined {
    if (!player.data.hasOwnProperty(type) && !Array.isArray(player.data[type])) {
        player.data[type] = [];
        return 0;
    }

    const items = player.data[type] as Array<Item<StoredItem>>;
    for (let i = 0; i <= maxSlotCount; i++) {
        const itemIndex = items.findIndex((item) => item.slot === i);

        // Means the slot is already taken.
        if (itemIndex >= 0) {
            continue;
        }

        return i;
    }

    return undefined;
}

const Shared = {
    find,
    findAvailableSlot,
    getTotalWeight,
    invokeEffect,
    queryData,
    queryTotal,
    update,
    updateData,
};

/**
 * If the function exists, override it.
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function to override the original function with.
 * @returns {void}
 */
function override<Key extends keyof typeof Shared>(functionName: Key, callback: typeof Shared[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        return;
    }

    exports[functionName] = callback;
}

const exports: typeof Shared & { override?: typeof override } = {
    ...Shared,
    override,
};

export default exports;
