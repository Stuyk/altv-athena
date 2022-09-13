import * as alt from 'alt-server';
import { BaseItem } from '../../../shared/interfaces/inventory';
import { Athena } from '../../api/athena';

const DEFAULT_TIMEOUT = 60000;
const COLLECTION_NAME = 'itemfactory';
let baseItems: Array<BaseItem> = [];
let isDoneRefreshing = true;

/**
 * Create collection, fetch all items, convert ids to strings, and assign to local cache.
 */
async function init() {
    isDoneRefreshing = false;

    // Create collection if it does not exist.
    await Athena.database.funcs.createCollection(COLLECTION_NAME);

    // Read all base items from database.
    baseItems = await Athena.database.funcs.fetchAllData<BaseItem>(COLLECTION_NAME);

    for (let i = 0; i < baseItems.length; i++) {
        baseItems[i]._id = baseItems[i]._id.toString();
    }

    isDoneRefreshing = true;
}

/**
 * Verify if the item factory is done refreshing.
 *
 * @return {Promise<void>}
 */
async function isRefreshComplete(): Promise<void> {
    return alt.Utils.waitFor(() => {
        return isDoneRefreshing;
    }, DEFAULT_TIMEOUT);
}

/**
 * It checks if a base item exists in the baseItems array.
 * @param {string} name - string - The name of the base item to check for.
 * @returns A boolean value.
 */
async function doesBaseItemExist(name: string): Promise<boolean> {
    await isRefreshComplete();

    name = name.toLowerCase();
    const index = baseItems.findIndex((item) => item.base.toLowerCase() === name);
    return index >= 0;
}

async function getByName(name: string): Promise<BaseItem> {
    await isRefreshComplete();
    name = name.toLowerCase();
    const index = baseItems.findIndex((item) => item.base.toLowerCase() === name);
    return baseItems[index];
}

/**
 * Add a base item to the database.
 *
 * @param {BaseItem} baseItem
 * @return {Promise<boolean>}
 */
async function add(baseItem: BaseItem): Promise<boolean> {
    await isRefreshComplete();

    baseItem.base = baseItem.base.toLowerCase();

    const index = baseItems.findIndex((item) => item.base.toLowerCase() === baseItem.base);
    if (index >= 0) {
        return false;
    }

    const newBaseItem = await Athena.database.funcs.insertData(baseItem, COLLECTION_NAME, true);
    if (typeof newBaseItem === 'undefined') {
        return false;
    }

    newBaseItem._id = newBaseItem._id.toString();
    baseItems.push(newBaseItem);
    return true;
}

/**
 * Returns all base items in the cache.
 *
 * @return {Promise<Array<BaseItem>>}
 */
async function get(): Promise<Array<BaseItem>> {
    await isRefreshComplete();
    return baseItems;
}

/**
 * Updates an item, and auto-increments the base reference version.
 *
 * @param {Omit<BaseItem, 'version'>} baseItem
 * @return {Promise<boolean>}
 */
async function update(baseItem: Omit<BaseItem, 'version'>): Promise<boolean> {
    await isRefreshComplete();

    isDoneRefreshing = false;

    baseItem.base = baseItem.base.toLowerCase();

    const index = baseItems.findIndex((item) => item.base.toLowerCase() === baseItem.base);
    if (index <= -1) {
        isDoneRefreshing = true;
        return false;
    }

    // Update Local Cache First
    baseItems[index] = Object.assign(baseItems[index], baseItem);
    baseItems[index].version = baseItems[index].version + 1;

    const baseItemCopy = Athena.utility.deepCloneObject<BaseItem>(baseItems[index]);
    delete baseItemCopy._id;

    // ! - TODO -> Auto-refresh players through refresh function.
    // ! - Automatically converts old item versions of logged in players to new item base versions.
    // ! - -> Updating Weight
    // ! - -> Updating Name

    isDoneRefreshing = true;

    return await Athena.database.funcs.updatePartialData(baseItems[index]._id, baseItemCopy, COLLECTION_NAME);
}

const ItemFactory = {
    add,
    doesBaseItemExist,
    get,
    getByName,
    isRefreshComplete,
    update,
};

function override<Key extends keyof typeof ItemFactory>(functionName: Key, callback: typeof ItemFactory[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        return;
    }

    exports[functionName] = callback;
}

const exports: typeof ItemFactory & { override?: typeof override } = {
    ...ItemFactory,
    override,
};

export default exports;
init();
