import * as Database from '@stuyk/ezmongodb';

/**
 * Returns a singleton document if it exists.
 *
 * @export
 * @template T
 * @param {string} collection
 * @return {(Promise<{ _id: string } & T>)}
 */
export async function get<T = {}>(collection: string): Promise<{ _id: string } & T> {
    const entries = await Database.fetchAllData<T & { _id: string }>(collection);
    return entries[0];
}

/**
 * Creates a single document to be stored in a collection.
 *
 * Only one document may ever exist for a collection.
 *
 * Returns the existing singleton if already present.
 *
 * @export
 * @template T
 * @param {string} collection
 * @param {T} data
 */
export async function create<T = {}>(collection: string, data: T): Promise<{ _id: string } & T> {
    if (data['_id']) {
        delete data['_id'];
    }

    const doesNotExist = await Database.createCollection(collection, true);
    if (doesNotExist) {
        await Database.insertData(data, collection);
        return await get<T>(collection);
    }

    return await get<T>(collection);
}

/**
 * Update / insert a single document into a collection.
 *
 * Only one document may ever exist for a collection.
 *
 * @export
 * @template T
 * @param {string} collection
 * @param {T} data
 * @returns {Promise<boolean>}
 */
export async function updateField(collection: string, fieldName: string, fieldValue: any): Promise<boolean> {
    if (fieldName === '_id') {
        return false;
    }

    const document = await get(collection);
    return await Database.updatePartialData(document._id.toString(), { [fieldName]: fieldValue }, collection);
}

/**
 * Update all the data from a single document in a collection.
 *
 * Only one document may ever exist for a collection.
 *
 * This takes the data from the database and applies your data on top of it.
 *
 * Returns true if updated successfully
 *
 * @export
 * @template T
 * @param {string} collection
 * @param {Partial<T>} data
 * @return {Promise<boolean>}
 */
export async function updateBulk<T = {}>(collection: string, data: Partial<T>): Promise<boolean> {
    if (data['_id']) {
        delete data['_id'];
    }

    const document = await get(collection);
    return await Database.updatePartialData(document._id.toString(), data, collection);
}
