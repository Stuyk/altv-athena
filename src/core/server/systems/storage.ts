import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import * as Athena from '@AthenaServer/api/index.js';
import { StoredItem } from '@AthenaShared/interfaces/item.js';

const openIdentifiers = [];
const boundIdentifiers: Array<{ id: number; storage: string }> = [];

function init() {
    Database.createCollection(Athena.database.collections.Storage);
}

export interface StorageInstance<CustomData = {}> {
    _id?: unknown;

    /**
     * The date which this storage was last accessed.
     *
     * @type {number}
     *
     */
    lastUsed: number;

    /**
     * The data stored in the database.
     *
     * @type {Array<StoredItem<CustomData>>}
     *
     */
    items: Array<StoredItem<CustomData>>;
}

/**
 * Creates a new storage, and returns the '_id' of the storage from the database.
 *
 * Use the ID returned to fetch the data with the other storage functions.
 *
 *
 * @param {Array<StoredItem>} items
 * @return {Promise<string>}
 */
export async function create(items: Array<StoredItem>): Promise<string> {
    if (Overrides.create) {
        return Overrides.create(items);
    }

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
 *
 * @param {string} id
 * @param {Array<StoredItem>} items
 * @returns {Promise<boolean>}
 */
export async function set(id: string, items: Array<StoredItem>): Promise<boolean> {
    if (Overrides.set) {
        return Overrides.set(id, items);
    }

    return await Database.updatePartialData(id, { items, lastUsed: Date.now() }, Athena.database.collections.Storage);
}

/**
 * Fetches stored items from a storage array.
 *
 *
 * @template CustomData
 * @param {string} id
 * @return {Promise<Array<StoredItem<CustomData>>>}
 */
export async function get<CustomData = {}>(id: string): Promise<Array<StoredItem<CustomData>>> {
    if (Overrides.get) {
        return Overrides.get<CustomData>(id);
    }

    const document = await Database.fetchData<StorageInstance<CustomData>>(
        '_id',
        id,
        Athena.database.collections.Storage,
    );

    return document.items;
}

/**
 * Sets a storage identifier as in use.
 *
 * Returns true if the value was set to in-use, and didn't already exist.
 *
 *
 * @param {string} id
 * @return {boolean}
 */
export function setAsOpen(id: string): boolean {
    if (Overrides.setAsOpen) {
        return Overrides.setAsOpen(id);
    }

    const index = openIdentifiers.findIndex((x) => x === id);
    if (index >= 0) {
        return false;
    }

    openIdentifiers.push(id);
    return true;
}

/**
 * Checks if a storage identifier is currently in use.
 *
 *
 * @param {string} id
 * @return {void}
 */
export function isOpen(id: string): boolean {
    if (Overrides.isOpen) {
        return Overrides.isOpen(id);
    }

    return openIdentifiers.findIndex((x) => x === id) >= 0;
}

/**
 * Removes the storage identifier from in-use status.
 *
 * Returns true if the value was successfully removed.
 *
 *
 * @param {string} id
 * @returns {boolean}
 */
export function removeAsOpen(id: string): boolean {
    if (Overrides.removeAsOpen) {
        return Overrides.removeAsOpen(id);
    }

    let wasRemoved = false;

    for (let i = openIdentifiers.length - 1; i >= 0; i--) {
        if (openIdentifiers[i] === id) {
            openIdentifiers.splice(i, 1);
            wasRemoved = true;
            break;
        }
    }

    for (let i = boundIdentifiers.length - 1; i >= 0; i--) {
        if (boundIdentifiers[i].storage === id) {
            boundIdentifiers.splice(i, 1);
            break;
        }
    }

    return wasRemoved;
}

/**
 * Marks the storage instance as closed if the player disconnects.
 *
 * Automatically removes the player when `removeAsOpen` is called.
 *
 * Returns false if a player binding is already present.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} id
 * @returns {boolean}
 */
export function closeOnDisconnect(player: alt.Player, id: string): boolean {
    if (Overrides.closeOnDisconnect) {
        return Overrides.closeOnDisconnect(player, id);
    }

    const index = boundIdentifiers.findIndex((x) => x.id === player.id);
    if (index >= 0) {
        return false;
    }

    boundIdentifiers.push({ id: player.id, storage: id });
    return true;
}

alt.on('playerDisconnect', (player: alt.Player) => {
    const index = boundIdentifiers.findIndex((x) => x.id === player.id);
    if (index <= 0) {
        return;
    }

    removeAsOpen(boundIdentifiers[index].storage);
});

init();

interface StorageFuncs {
    create: typeof create;
    set: typeof set;
    get: typeof get;
    setAsOpen: typeof setAsOpen;
    removeAsOpen: typeof removeAsOpen;
    isOpen: typeof isOpen;
    closeOnDisconnect: typeof closeOnDisconnect;
}

const Overrides: Partial<StorageFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
export function override(functionName: 'set', callback: typeof set);
export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'setAsOpen', callback: typeof setAsOpen);
export function override(functionName: 'isOpen', callback: typeof isOpen);
export function override(functionName: 'removeAsOpen', callback: typeof removeAsOpen);
export function override(functionName: 'closeOnDisconnect', callback: typeof closeOnDisconnect);
/**
 * Used to override storage functions.
 *
 *
 * @param {keyof StorageFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof StorageFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
