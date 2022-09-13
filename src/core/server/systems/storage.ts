import * as alt from 'alt-server';
import { IStorage } from '../../shared/interfaces/iStorage';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../interface/iDatabaseCollections';

let isInUse: { [storage_id: string]: boolean } = {};

const StorageRef = {
    /**
     * Create a storage box and return the full storage Document.
     * @static
     * @param {IStorage} storage
     * @return {IStorage}
     * @memberof StorageSystem
     */
    async create(storage: IStorage): Promise<IStorage> {
        storage.lastUpdate = Date.now();

        const storageData = await Database.insertData(storage, Collections.Storage, true);
        storageData._id = storageData._id.toString();

        return storageData;
    },

    /**
     * Get a storage box by ID.
     * @static
     * @param {string} id
     * @return {(Promise<IStorage | null>)}
     * @memberof StorageSystem
     */
    async get(id: string): Promise<IStorage | null> {
        const storageData = await Database.fetchData<IStorage>('_id', id, Collections.Storage);
        storageData._id = storageData._id.toString();
        return storageData;
    },

    /**
     * Updates this storage object.
     * Can be used to update item list, maximum amount, etc.
     * @static
     * @param {string} id
     * @param {Partial<IStorage>} data
     * @return {*}  {Promise<boolean>}
     * @memberof StorageSystem
     */
    async update(id: string, data: Partial<IStorage>): Promise<boolean> {
        if (!id || !data) {
            return false;
        }

        if (Object.keys(data).length <= 0) {
            return false;
        }

        return await Database.updatePartialData(id, { ...data, lastUpdate: Date.now() }, Collections.Storage);
    },

    /**
     * Set the storage box as in use.
     * @static
     * @param {string} id
     * @param {boolean} value
     * @memberof StorageSystem
     */
    setRestricted(id: string, value: boolean) {
        isInUse[id] = value;
    },

    /**
     * Check if this storage box is currently in use.
     * @static
     * @param {string} id
     * @return {*}  {boolean}
     * @memberof StorageSystem
     */
    isRestricted(id: string): boolean {
        return isInUse[id];
    },
};

/**
 * It takes a function name and a callback, and if the function exists in the exports object, it
 * overrides it with the callback
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function you want to override.
 * @returns The function is being returned.
 */
function override<Key extends keyof typeof StorageRef>(functionName: Key, callback: typeof StorageRef[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`systems/storage.ts does not provide an export named ${functionName}`);
        return;
    }

    exports[functionName] = callback;
}

export const StorageSystem: typeof StorageRef & { override?: typeof override } = {
    ...StorageRef,
    override,
};
