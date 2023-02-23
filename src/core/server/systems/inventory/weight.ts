import { Item, StoredItem } from '@AthenaShared/interfaces/item';
import * as config from './config';

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
