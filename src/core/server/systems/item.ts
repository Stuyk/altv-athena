import { ItemType } from '../../shared/enums/itemType';
import { Item } from '../../shared/interfaces/Item';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { sha256Random } from '../utility/encryption';

export class ItemFactory {
    /**
     * Creates a new item with a hash.
     * @static
     * @param {string} name The name of the item.
     * @param {string} description The description of this item.
     * @param {string} icon The corresponding item icon for this item.
     * @param {number} quantity The number or amount of stacked items in this item.
     * @param {ItemType} behavior General item behavior of this item.
     * @param {{ [key: string]: any }} data
     * @return {*}  {Item}
     * @memberof ItemFactory
     */
    static create(
        name: string,
        description: string,
        icon: string,
        quantity: number,
        behavior: ItemType,
        data: { [key: string]: any },
        slot: number
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
            slot
        };

        item.hash = sha256Random(JSON.stringify(item));

        if (item.quantity <= -1) {
            item.quantity = 1;
        }

        return item;
    }

    /**
     * Creates an exact clone of an item but gives it a new hash.
     * @static
     * @param {Item} item
     * @return {*}  {Item}
     * @memberof ItemFactory
     */
    static clone(item: Item): Item {
        const newItem: Item = deepCloneObject(item);

        newItem.hash = sha256Random(JSON.stringify(item));

        return newItem;
    }
}
