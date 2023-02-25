import { InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces';
import { StoredItem } from '@AthenaShared/interfaces/item';
import { deepCloneArray } from '@AthenaShared/utility/deepCopy';
import * as config from './config';

export function findOpen(slotSize: InventoryType | number, data: Array<StoredItem>): number | undefined {
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
    const copyOfData = deepCloneArray<StoredItem>(data);
    const index = copyOfData.findIndex((x) => x.slot === slot);
    if (index <= -1) {
        return undefined;
    }

    copyOfData.splice(index, 1);
    return copyOfData;
}
