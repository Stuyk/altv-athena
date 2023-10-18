import { StoredItem } from '@AthenaShared/interfaces/item.js';

export interface ItemDrop {
    /**
     * The dbName of the item to be obtained
     *
     * @type {string}
     * @memberof ItemDropRatio
     */
    dbName: string;

    /**
     * How often this item will pull in a drop
     *
     * @type {string}
     * @memberof ItemDrop
     */
    frequency: {
        /**
         * Usually '1'
         *
         * @type {number}
         */
        numerator: number;

        /**
         * Usually the higher number. Think like 18, 32, 64, etc.
         *
         * Set to `1` if you want to include it in every drop.
         *
         * @type {number}
         */
        denominator: number;
    };

    /**
     * The minimum amount of items this will give.
     *
     * Always set to at least 1.
     *
     * @type {number}
     * @memberof ItemDrop
     */
    amountMin: number;

    /**
     * The maximum amount of items this can give.
     *
     * Set to `1` if you only ever want to give `1`.
     *
     * @type {number}
     * @memberof ItemDrop
     */
    amountMax: number;
}

/**
 * Given a drop table, roll random items from the table.
 *
 * Specify maximumDrops, if you want to allow more than `1` item to be pulled.
 *
 * This can sometimes return `zero` items depending on the odds.
 *
 * @export
 * @param {Array<ItemDrop>} items
 * @return {(Array<Omit<StoredItem, 'data' | 'slot'>>)}
 */
export function get(items: Array<ItemDrop>, maximumDrops: number = 1): Array<Omit<StoredItem, 'data' | 'slot'>> {
    const finalDrops: Array<Omit<StoredItem, 'data' | 'slot'>> = [];

    for (let itemDrop of items) {
        const odds = { numerator: itemDrop.frequency.numerator, denominator: itemDrop.frequency.denominator };
        const randomNumber = Math.floor(Math.random() * odds.denominator) + 1;

        if (randomNumber !== 1) {
            continue;
        }

        const itemCount = Math.floor(Math.random() * itemDrop.amountMax) + itemDrop.amountMin;
        finalDrops.push({ dbName: itemDrop.dbName, quantity: itemCount });

        if (finalDrops.length >= maximumDrops) {
            break;
        }
    }

    return finalDrops;
}
