import Database from '@stuyk/ezmongodb';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { Item } from '../../shared/interfaces/item';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { Collections } from '../interface/DatabaseCollections';

const databaseItemNames: Array<string> = [];

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
            databaseItemNames.push(items[i].dbName);
        }
    }

    /**
     * Creates and adds an item to the database if it does not exist.
     * @static
     * @param {Item} item
     * @memberof ItemFactory
     */
    static async add(item: Item): Promise<Item> {
        delete item.quantity;

        // Check that the item has 'dbName'
        if (!item.dbName) {
            console.error(`Item during add is missing 'dbName' for item ${JSON.stringify(item)}`);
            console.error(`Add a 'dbName' to the item to successfully append it to the database.`);
            return null;
        }

        // Prevents duplicate items being inserted
        if (databaseItemNames.includes(item.dbName)) {
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
        if (!databaseItemNames.includes(dbItemName)) {
            return null;
        }

        const item = await Database.fetchData<Item>('dbName', dbItemName, Collections.Items);
        if (!item) {
            return null;
        }

        return deepCloneObject(item);
    }

    /**
     * Check if an item with a specified dbName exists.
     * @static
     * @param {string} dbItemName
     * @return {*}  {boolean}
     * @memberof ItemFactory
     */
    static doesExist(dbItemName: string): boolean {
        return databaseItemNames.includes(dbItemName);
    }

    /**
     * Creates a new item with a hash.
     * @static
     * @param {string} name The name of the item.
     * @param {string} description The description of this item.
     * @param {string} icon The corresponding item icon for this item.
     * @param {number} quantity The number or amount of stacked items in this item.
     * @param {ITEM_TYPE} behavior General item behavior of this item.
     * @param {{ [key: string]: any }} data
     * @return {*}  {Item}
     * @memberof ItemFactory
     */
    static create(
        name: string,
        description: string,
        icon: string,
        quantity: number,
        behavior: ITEM_TYPE,
        data: { [key: string]: any },
        slot: number,
    ): Item | null {
        if (slot <= -1) {
            return null;
        }

        const item: Item = {
            name,
            description,
            icon,
            quantity,
            behavior,
            data,
            slot,
        };

        if (item.quantity <= -1) {
            item.quantity = 1;
        }

        return item;
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
