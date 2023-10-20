import { Item, StoredItem } from '@AthenaShared/interfaces/item.js';
import * as Athena from '@AthenaServer/api/index.js';
import * as config from './config.js';

/**
 * Returns the total weight of a given data set.
 *
 * @param {Array<StoredItem>} data
 * @return {number}
 */
export function getDataWeight(data: Array<StoredItem | Item>): number {
    let totalWeight = 0;
    for (let item of data) {
        if (!item.totalWeight) {
            continue;
        }

        if (item.isEquipped) {
            continue;
        }

        totalWeight += item.totalWeight;
    }

    return totalWeight;
}

/**
 * Get the total weight for given data sets.
 *
 * @param {(Array<Array<StoredItem | Item>>)} dataSets
 * @return {number}
 */
export function getTotalWeight(dataSets: Array<Array<StoredItem | Item>>): number {
    let weight = 0;

    for (let dataSet of dataSets) {
        weight += getDataWeight(dataSet);
    }

    return weight;
}

/**
 * Determine if the weight is exceeded for a given data sets given the amount of weight it cannot exceed.
 *
 * @param {(Array<Array<StoredItem | Item>>)} dataSets
 * @param {number} [amount=DEFAULT_CONFIG.weight.player]
 * @return {boolean}
 */
export function isWeightExceeded(dataSets: Array<Array<StoredItem | Item>>, amount: number = 255): boolean {
    if (!config.get().weight.enabled) {
        return false;
    }

    const total = getTotalWeight(dataSets);
    if (total > amount) {
        return true;
    }

    return false;
}

/**
 * Update weight for a given data set, and all items.
 *
 * @export
 * @template T
 * @param {(Array<StoredItem<T> | Item>)} dataSet
 * @return {(Array<StoredItem<T> | Item>)}
 */
export function update<T = {}>(dataSet: Array<StoredItem<T>>): Array<StoredItem<T>> {
    for (let i = 0; i < dataSet.length; i++) {
        const baseItem = Athena.systems.inventory.factory.getBaseItem(dataSet[i].dbName);
        if (typeof baseItem === 'undefined') {
            continue;
        }

        dataSet[i].totalWeight = baseItem.weight * dataSet[i].quantity;
    }

    return dataSet;
}

interface WeightFuncs {
    getDataWeight: typeof getDataWeight;
    getTotalWeight: typeof getTotalWeight;
    isWeightExceeded: typeof isWeightExceeded;
}

const Overrides: Partial<WeightFuncs> = {};

export function override(functionName: 'getDataWeight', callback: typeof getDataWeight);
export function override(functionName: 'getTotalWeight', callback: typeof getTotalWeight);
export function override(functionName: 'isWeightExceeded', callback: typeof isWeightExceeded);
/**
 * Used to override inventory item weight functionality
 *
 *
 * @param {keyof WeightFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof WeightFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
