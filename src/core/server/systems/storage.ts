import Database from '@stuyk/ezmongodb';
import * as Athena from '@AthenaServer/api';
import { StoredItem } from '@AthenaShared/interfaces/item';

function init() {
    Database.createCollection(Athena.database.collections.Storage);
}

export interface StorageInstance<CustomData = {}> {
    _id?: unknown;

    /**
     * The date which this storage was last accessed.
     *
     * @type {number}
     * @memberof StorageInstance
     */
    lastUsed: number;

    /**
     * The data stored in the database.
     *
     * @type {Array<StoredItem<CustomData>>}
     * @memberof StorageInstance
     */
    items: Array<StoredItem<CustomData>>;
}

/**
 * Creates a new storage, and returns the '_id' of the storage from the database.
 *
 * Use the ID returned to fetch the data with the other storage functions.
 *
 * @export
 * @param {Array<StoredItem>} items
 * @return {Promise<string>}
 */
export async function create(items: Array<StoredItem>): Promise<string> {
    const document = await Database.insertData<StorageInstance>(
        { items, lastUsed: Date.now() },
        Athena.database.collections.Storage,
        true,
    );

    return document._id.toString();
}

/**
 * Stores items into a database instance by providing the storage identifier, and the modified items array.
 *
 * @export
 * @param {string} id
 * @param {Array<StoredItem>} items
 * @returns {Promise<boolean>}
 */
export async function set(id: string, items: Array<StoredItem>): Promise<boolean> {
    return await Database.updatePartialData(id, { items, lastUsed: Date.now() }, Athena.database.collections.Storage);
}

/**
 * Fetches stored items from a storage array.
 *
 * @export
 * @template CustomData
 * @param {string} id
 * @return {Promise<Array<StoredItem<CustomData>>>}
 */
export async function get<CustomData = {}>(id: string): Promise<Array<StoredItem<CustomData>>> {
    const document = await Database.fetchData<StorageInstance<CustomData>>(
        '_id',
        id,
        Athena.database.collections.Storage,
    );

    return document.items;
}

init();
