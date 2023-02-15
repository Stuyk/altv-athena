import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { ItemDrop, StoredItem } from '@AthenaShared/interfaces/item';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { databaseConst } from '@AthenaServer/api/consts/constDatabase';

type UnpushedItemDrop = Omit<ItemDrop, '_id'>;

const DEFAULT_EXPIRATION = 60000 * 5; // 5 Minutes
const drops: Array<ItemDrop> = [];
const markAsTaken: { [key: string]: boolean } = {};

export const Internal = {
    /**
     * Initialize all item drops stored in the database.
     *
     */
    async init() {
        await databaseConst.funcs.createCollection(databaseConst.collections.Drops);

        const results = await databaseConst.funcs.fetchAllData<ItemDrop>(databaseConst.collections.Drops);
        for (let i = 0; i < results.length; i++) {
            results[i]._id = String(results[i]._id);
            drops.push(results[i]);
            Athena.controllers.itemDrops.append(results[i]);
            markAsTaken[String(results[i]._id)] = false;
        }
    },
    /**
     * Adds a new item drop to the database.
     *
     * @param {StoredItem} storedItem
     * @return {Promise<ItemDrop>}
     */
    async addToDatabase(storedItem: UnpushedItemDrop): Promise<ItemDrop> {
        storedItem = deepCloneObject<UnpushedItemDrop>(storedItem);
        const document = await Athena.database.funcs.insertData<UnpushedItemDrop>(
            storedItem,
            Athena.database.collections.Drops,
            true,
        );

        const convertedDoc = <ItemDrop>document;
        convertedDoc._id = String(convertedDoc._id);
        markAsTaken[String(convertedDoc._id)] = false;
        drops.push(convertedDoc);
        return convertedDoc;
    },
    /**
     * Simply tries to remove an entry from the database.
     *
     * @param {string} id
     */
    async removeFromDatabase(id: string) {
        await Athena.database.funcs.deleteById(id, Athena.database.collections.Drops);
    },
};

export const ItemDrops = {
    /**
     * Add a dropped item.
     *
     * @param {StoredItem} item
     * @param {alt.IVector3} pos
     * @return {Promise<string>}
     */
    async add(item: StoredItem, pos: alt.IVector3, player: alt.Player = undefined): Promise<string> {
        const baseItem = Athena.systems.itemFactory.sync.getBaseItem(item.dbName);
        if (typeof baseItem === 'undefined') {
            return undefined;
        }

        const expiration =
            typeof baseItem.msTimeout === 'number' ? Date.now() + baseItem.msTimeout : Date.now() + DEFAULT_EXPIRATION;

        item.isEquipped = false;

        const document = await Internal.addToDatabase({
            ...item,
            name: baseItem.name,
            pos,
            expiration,
            model: baseItem.model,
        });

        Athena.controllers.itemDrops.append(document);

        if (typeof player !== 'undefined') {
            Athena.events.player.trigger('drop-item', player, item);
        }

        return document._id as string;
    },
    /**
     * Get the current item drop.
     *
     * @param {string} id
     * @return {(ItemDrop | undefined)}
     */
    get(id: string): ItemDrop | undefined {
        return drops.find((x) => x._id === id);
    },
    /**
     * Remove the dropped item based on identifier.
     *
     * @param {string} id
     * @return {(Promise<StoredItem | undefined>)}
     */
    async sub(id: string): Promise<StoredItem | undefined> {
        let itemClone: StoredItem = undefined;

        for (let i = drops.length - 1; i >= 0; i--) {
            if (Date.now() > drops[i].expiration && drops[i]._id !== id) {
                delete markAsTaken[id];
                drops.splice(i, 1);
                continue;
            }

            if (drops[i]._id !== id) {
                continue;
            }

            delete markAsTaken[id];

            Athena.controllers.itemDrops.remove(id);
            const newItem = deepCloneObject<ItemDrop>(drops.splice(i, 1));
            await Internal.removeFromDatabase(id);
            delete newItem._id;
            delete newItem.pos;
            delete newItem.expiration;
            delete newItem.pos;
            delete newItem.name;
            itemClone = newItem;
        }

        return itemClone;
    },
    isItemAvailable(_id: string) {
        return typeof markAsTaken[_id] !== 'undefined' && markAsTaken[_id] === false;
    },
    markForTaken(_id: string, value: boolean) {
        markAsTaken[_id] = value;
    },
};

Internal.init();
