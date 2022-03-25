import { IStorage } from '../../shared/interfaces/iStorage';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../interface/iDatabaseCollections';

let isInUse: { [storage_id: string]: boolean } = {};

export class StorageSystem {
    /**
     * Create a storage box and return the full storage Document.
     * @static
     * @param {IStorage} storage
     * @return {IStorage}
     * @memberof StorageSystem
     */
    static async create(storage: IStorage): Promise<IStorage> {
        storage.lastUpdate = Date.now();

        const storageData = await Database.insertData(storage, Collections.Storage, true);
        storageData._id = storageData._id.toString();

        return storageData;
    }

    /**
     * Get a storage box by ID.
     * @static
     * @param {string} id
     * @return {(Promise<IStorage | null>)}
     * @memberof StorageSystem
     */
    static async get(id: string): Promise<IStorage | null> {
        const storageData = await Database.fetchData<IStorage>('_id', id, Collections.Storage);
        storageData._id = storageData._id.toString();
        return storageData;
    }

    /**
     * Updates this storage object.
     * Can be used to update item list, maximum amount, etc.
     * @static
     * @param {string} id
     * @param {Partial<IStorage>} data
     * @return {*}  {Promise<boolean>}
     * @memberof StorageSystem
     */
    static async update(id: string, data: Partial<IStorage>): Promise<boolean> {
        if (!id || !data) {
            return false;
        }

        if (Object.keys(data).length <= 0) {
            return false;
        }

        return await Database.updatePartialData(id, { ...data, lastUpdate: Date.now() }, Collections.Storage);
    }

    /**
     * Set the storage box as in use.
     * @static
     * @param {string} id
     * @param {boolean} value
     * @memberof StorageSystem
     */
    static setRestricted(id: string, value: boolean) {
        isInUse[id] = value;
    }

    /**
     * Check if this storage box is currently in use.
     * @static
     * @param {string} id
     * @return {*}  {boolean}
     * @memberof StorageSystem
     */
    static isRestricted(id: string): boolean {
        return isInUse[id];
    }
}
