import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { ItemDrop, StoredItem } from '@AthenaShared/interfaces/item';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { databaseConst } from '@AthenaServer/api/consts/constDatabase';

const drops: Array<ItemDrop> = [];

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
        }
    },
    /**
     * Adds a new item drop to the database.
     *
     * @param {StoredItem} storedItem
     * @return {Promise<ItemDrop>}
     */
    async addToDatabase(storedItem: StoredItem, pos: alt.IVector3): Promise<ItemDrop> {
        storedItem = deepCloneObject<StoredItem>(storedItem);
        const document = await Athena.database.funcs.insertData<StoredItem>(
            Object.assign(storedItem, pos),
            Athena.database.collections.Drops,
            true,
        );

        const convertedDoc = <ItemDrop>document;
        convertedDoc._id = String(convertedDoc._id);
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
    async add(item: StoredItem, pos: alt.IVector3): Promise<string> {
        const document = await Internal.addToDatabase(item, pos);
        Athena.controllers.itemDrops.append(document);
        return document._id as string;
    },
    /**
     * Remove the dropped item based on identifier.
     *
     * @param {string} id
     * @return {(Promise<StoredItem | undefined>)}
     */
    async sub(id: string): Promise<StoredItem | undefined> {
        for (let i = drops.length - 1; i >= 0; i--) {
            if (drops[i]._id !== id) {
                continue;
            }

            const itemClone = deepCloneObject<ItemDrop>(drops.splice(i, 1));
            await Internal.removeFromDatabase(id);
            delete itemClone._id;
            delete itemClone.pos;
            return itemClone;
        }

        return undefined;
    },
};

Internal.init();
