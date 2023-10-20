import { InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces.js';
import { StoredItem } from '@AthenaShared/interfaces/item.js';
import { deepCloneArray } from '@AthenaShared/utility/deepCopy.js';
import * as config from './config.js';

/**
 * Find an open slot that is available within a dataset.
 *
 *
 * @param {(InventoryType | number)} slotSize
 * @param {Array<StoredItem>} data
 * @return {(number | undefined)}
 */
export function findOpen(slotSize: InventoryType | number, data: Array<StoredItem>): number | undefined {
    if (Overrides.findOpen) {
        return Overrides.findOpen(slotSize, data);
    }

    if (typeof slotSize === 'string') {
        if (!config.get()[String(slotSize)]) {
            return undefined;
        }
    }

    const maxSlot = typeof slotSize === 'number' ? Number(slotSize) : config.get()[String(slotSize)].size;

    for (let i = 0; i < maxSlot; i++) {
        const index = data.findIndex((x) => x.slot === i);
        if (index >= 0) {
            continue;
        }

        return i;
    }

    return undefined;
}

/**
 * Get an item at a specific slot.
 * Returns undefined if an item is unavailable in a slot.
 *
 * @param {number} slot
 * @param {Array<StoredItem>} data
 * @return {(StoredItem | undefined)}
 */
export function getAt<CustomData = {}>(slot: number, data: Array<StoredItem>): StoredItem<CustomData> | undefined {
    if (Overrides.getAt) {
        return Overrides.getAt<CustomData>(slot, data);
    }

    const index = data.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return undefined;
    }

    return data[index] as StoredItem<CustomData>;
}

/**
 * Remove a specific item from a specific slot.
 *
 * @param {number} slot
 * @param {Array<StoredItem>} data
 * @return {(Array<StoredItem> | undefined)} Returns undefined if the item was not found.
 */
export function removeAt(slot: number, data: Array<StoredItem>): Array<StoredItem> | undefined {
    if (Overrides.removeAt) {
        return Overrides.removeAt(slot, data);
    }

    const copyOfData = deepCloneArray<StoredItem>(data);
    const index = copyOfData.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return undefined;
    }

    copyOfData.splice(index, 1);
    return copyOfData;
}

interface SlotFuncs {
    findOpen: typeof findOpen;
    removeAt: typeof removeAt;
    getAt: typeof getAt;
}

const Overrides: Partial<SlotFuncs> = {};

export function override(functionName: 'findOpen', callback: typeof findOpen);
export function override(functionName: 'removeAt', callback: typeof removeAt);
export function override(functionName: 'getAt', callback: typeof getAt);
/**
 * Used to override inventory item slot functionality
 *
 *
 * @param {keyof SlotFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof SlotFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
