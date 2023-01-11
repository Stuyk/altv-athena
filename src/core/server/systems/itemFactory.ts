import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { BaseItem, StoredItem, Item, DefaultItemBehavior } from '@AthenaShared/interfaces/item';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';

let databaseItems: Array<BaseItem<DefaultItemBehavior, {}>> = [];
let isDoneLoading = false;

const InternalFunctions = {
    async init() {
        await Athena.database.funcs.createCollection(Athena.database.collections.Items);
        databaseItems = await Athena.database.funcs.fetchAllData<BaseItem>(Athena.database.collections.Items);

        // Convert all MongoDB _id entries to strings.
        for (let i = 0; i < databaseItems.length; i++) {
            databaseItems[i]._id = databaseItems[i]._id.toString();
        }

        isDoneLoading = true;
    },
};

export const ItemFactory = {
    /**
     * Wait until the `isDoneLoading` variable is set to `true` before continuing.
     */
    async isDoneLoading(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isDoneLoading) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 0);
        });
    },
    /**
     * Updates or inserts a new database item into the database.
     * If a verison is specified and it does not find a matching version it will add a new item.
     * If a version is not specified; it will find a non-versioned item to replace.
     *
     * @param {BaseItem} baseItem
     */
    async upsert(baseItem: BaseItem) {
        await ItemFactory.isDoneLoading();

        const index = databaseItems.findIndex((item) => {
            const hasMatchingName = item.dbName === baseItem.dbName;

            if (!hasMatchingName) {
                return false;
            }

            const hasMatchingVersion = item.version === baseItem.version;
            if (!hasMatchingVersion) {
                return false;
            }

            return true;
        });

        // Create New Item Entry
        if (index <= -1) {
            const document = await Athena.database.funcs.insertData<BaseItem>(
                baseItem,
                Athena.database.collections.Items,
                true,
            );

            document._id = document._id.toString();
            databaseItems.push(document);
            return;
        }

        // Update Existing Item
        databaseItems[index] = deepCloneObject<BaseItem>(baseItem);
        await Athena.database.funcs.updatePartialData(
            baseItem._id,
            databaseItems[index],
            Athena.database.collections.Items,
        );
    },
    /**
     * Get a base item based on dbName, and version if supplied.
     *
     * @template CustomData
     * @template CustomBehavior
     * @param {string} dbName
     * @param {number} [version=undefined]
     * @return {(BaseItem<DefaultItemBehavior & CustomBehavior, CustomData>)}
     */
    async getBaseItem<CustomData = {}, CustomBehavior = {}>(
        dbName: string,
        version: number = undefined,
    ): Promise<BaseItem<DefaultItemBehavior & CustomBehavior, CustomData>> {
        await ItemFactory.isDoneLoading();

        const index = databaseItems.findIndex((item) => {
            const hasMatchingName = item.dbName === dbName;

            if (!hasMatchingName) {
                return false;
            }

            const hasMatchingVersion = item.version === version;
            if (!hasMatchingVersion) {
                return false;
            }

            return true;
        });

        if (index <= -1) {
            alt.logWarning(`Could not find item with dbName: ${dbName} in getBaseItem`);
            return undefined;
        }

        return Athena.utility.deepCloneObject<BaseItem<DefaultItemBehavior & CustomBehavior, CustomData>>(
            databaseItems[index],
        );
    },
    item: {
        convert: {
            /**
             * Converts an item from a player inventory, equipment, or toolbar to a full item set.
             * Also performs weight calculations.
             *
             * @template CustomData
             * @template CustomBehavior
             * @param {StoredItem<CustomData>} item
             * @return {(Item<CustomBehavior & DefaultItemBehavior, CustomData> | undefined)}
             */
            async fromStoredItem<CustomData = {}, CustomBehavior = {}>(
                item: StoredItem<CustomData>,
            ): Promise<Item<CustomBehavior & DefaultItemBehavior, CustomData> | undefined> {
                await ItemFactory.isDoneLoading();

                const baseItem = await ItemFactory.getBaseItem<CustomData, CustomBehavior>(item.dbName, item.version);
                if (typeof baseItem === 'undefined') {
                    return undefined;
                }

                const combinedItem = Object.assign(baseItem, item) as Item<
                    CustomBehavior & DefaultItemBehavior,
                    CustomData
                >;

                if (typeof combinedItem.weight === 'number') {
                    combinedItem.totalWeight = combinedItem.weight * combinedItem.quantity;
                }

                return combinedItem;
            },
            /**
             * Converts a full item, into a storeable version of the item.
             * Only certain parts of the item will be stored.
             *
             * @template CustomData
             * @param {Item<DefaultItemBehavior, CustomData>} item
             * @return {StoredItem<CustomData>}
             */
            async toStoredItem<CustomData = {}>(
                item: Item<DefaultItemBehavior, CustomData>,
            ): Promise<StoredItem<CustomData>> {
                await ItemFactory.isDoneLoading();

                const storedItem: StoredItem<CustomData> = {
                    dbName: item.dbName,
                    data: item.data,
                    quantity: item.quantity,
                    slot: item.slot,
                };

                if (typeof item.weight === 'number') {
                    item.totalWeight = item.quantity * item.weight;
                }

                if (typeof item.version !== 'undefined') {
                    storedItem.version = item.version;
                }

                return storedItem;
            },
        },
    },
};

InternalFunctions.init();
