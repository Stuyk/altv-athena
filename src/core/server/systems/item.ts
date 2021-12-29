import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { Item } from '../../shared/interfaces/item';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { Collections } from '../interface/DatabaseCollections';

const databaseItemNames: Array<{ name: string; dbName: string }> = [];
let isDoneLoading = false;

export class ItemFactory {
    /**
     * Initialize the Item Factory Database
     * @static
     * @memberof ItemFactory
     */
    static async init() {
        await Database.createCollection(Collections.Items);
        const items = await Database.fetchAllData<Item>(Collections.Items);
        for (let i = 0; i < items.length; i++) {
            databaseItemNames.push({ name: items[i].name, dbName: items[i].dbName });
        }

        isDoneLoading = true;
    }

    static async isDoneLoading(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isDoneLoading) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 100);
        });
    }

    /**
     * Creates and adds an item to the database if it does not exist.
     * @static
     * @param {Item} item
     * @memberof ItemFactory
     */
    static async add(item: Item): Promise<Item> {
        await ItemFactory.isDoneLoading();

        delete item.quantity;

        // Check that the item has 'dbName'
        if (!item.dbName) {
            console.error(`Item during add is missing 'dbName' for item ${JSON.stringify(item)}`);
            console.error(`Add a 'dbName' to the item to successfully append it to the database.`);
            return null;
        }

        // Prevents duplicate items being inserted
        if (databaseItemNames.findIndex((x) => x.dbName === item.dbName) >= 0) {
            return null;
        }

        if (item._id) {
            return null;
        }

        // Creates and adds an item into the item database
        const itemDocument = await Database.insertData(item, Collections.Items, true);
        if (!itemDocument) {
            return null;
        }

        databaseItemNames.push({ name: itemDocument.name, dbName: itemDocument.dbName });
        alt.log(`Added Item to Registry | ${itemDocument.name} | ${itemDocument.dbName}`);
        return itemDocument;
    }

    /**
     * Simply get an item from the Database.
     * @static
     * @param {string} dbItemName
     * @return { Promise<Item> }
     * @memberof ItemFactory
     */
    static async get(dbItemName: string): Promise<Item | null> {
        await ItemFactory.isDoneLoading();

        if (databaseItemNames.findIndex((x) => x.dbName === dbItemName) <= -1) {
            return null;
        }

        const item = await Database.fetchData<Item>('dbName', dbItemName, Collections.Items);
        if (!item) {
            return null;
        }

        return deepCloneObject(item);
    }

    /**
     * Get item by item name.
     * It's like a fuzzy search for an item.
     * @static
     * @param {string} name
     * @return {*}
     * @memberof ItemFactory
     */
    static async getByName(name: string): Promise<Item | null> {
        await ItemFactory.isDoneLoading();

        const itemName = name.replace(/\s/g, '').toLowerCase();

        // First Pass Through - Exact Name Check
        let index = databaseItemNames.findIndex((itemRef) => {
            const refItemName = itemRef.name.replace(/\s/g, '').toLowerCase();
            if (refItemName === itemName) {
                return true;
            }

            return false;
        });

        // Second Pass Through - Includes Search
        if (index <= -1) {
            index = databaseItemNames.findIndex((itemRef) => {
                const refItemName = itemRef.name.replace(/\s/g, '').toLowerCase();
                if (refItemName.includes(itemName)) {
                    return true;
                }

                return false;
            });
        }

        if (index <= -1) {
            return null;
        }

        return await ItemFactory.get(databaseItemNames[index].dbName);
    }

    /**
     * Check if an item with a specified dbName exists.
     * @static
     * @param {string} dbItemName
     * @return {*}  {boolean}
     * @memberof ItemFactory
     */
    static async doesExist(dbItemName: string): Promise<boolean> {
        await ItemFactory.isDoneLoading();

        const index = databaseItemNames.findIndex((x) => x.dbName === dbItemName);
        return index !== -1;
    }

    /**
     * Creates an exact clone of an item but gives it a new hash.
     * @static
     * @param {Item} item
     * @return {Item}
     * @memberof ItemFactory
     */
    static clone(item: Item): Item {
        return deepCloneObject(item);
    }
}

ItemFactory.init();
