import * as Athena from '@AthenaServer/api/index.js';
import { BaseItemEx, ItemEx, StoredItemEx } from '@AthenaShared/interfaces/item.js';

/**
 * Converts a stored item into a full item.
 *
 * Does not perform any inventory changes.
 *
 * Returns undefined if base item was not found.
 *
 * @export
 * @template CustomData
 * @param {StoredItemEx<CustomData>} storedItem
 */
export function toItem<CustomData = {}>(storedItem: StoredItemEx<CustomData>): ItemEx<CustomData> | undefined {
    const results = Athena.systems.inventory.manager.convertFromStored<CustomData>([storedItem]);

    if (results.length <= 0) {
        return undefined;
    }

    return results[0];
}

/**
 * Convert a stored Item to a base item
 *
 * Does not perform any inventory changes.
 *
 * @export
 * @template CustomData
 * @param {StoredItemEx<CustomData>} storedItem
 * @return {BaseItemEx<CustomData>}
 */
export function toBaseItem<CustomData = {}>(storedItem: StoredItemEx<CustomData>): BaseItemEx<CustomData> {
    return Athena.systems.inventory.factory.getBaseItem<CustomData>(storedItem.dbName, storedItem.version);
}

/**
 * Convert a Base Item to a stored item
 *
 * Does not perform any inventory changes.
 *
 * @export
 * @template CustomData
 * @param {BaseItemEx<CustomData>} baseItem
 * @param {number} quantity
 * @return {*}
 */
export function toStoredItem<CustomData = {}>(baseItem: BaseItemEx<CustomData>, quantity: number) {
    return Athena.systems.inventory.factory.fromBaseToStored(baseItem, quantity);
}
