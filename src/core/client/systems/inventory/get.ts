import { onInventoryUpdate } from '@AthenaClient/events/onInventoryUpdate.js';
import { Item } from '@AthenaShared/interfaces/item.js';

export type ItemChangeCallback = (items: Array<Item>) => void;
export type WeightChangeCallback = (weight: number) => void;

const toolbarChangeCbs: Array<ItemChangeCallback> = [];
const inventoryChangeCbs: Array<ItemChangeCallback> = [];
const weightChangeCbs: Array<WeightChangeCallback> = [];

let currentInventory: Array<Item> = [];
let currentToolbar: Array<Item> = [];
let currentTotalWeight: number;

/**
 * A list of the current items in the toolbar.
 *
 * @export
 * @return {Array<Item>}
 */
export function toolbar(): Array<Item> {
    return currentToolbar;
}

/**
 * A list of the current items in the inventory.
 *
 * @export
 * @return {Array<Item>}
 */
export function inventory(): Array<Item> {
    return currentInventory;
}

/**
 * A list of the current total weight of inventory and toolbar.
 *
 * @export
 * @return {number}
 */
export function totalWeight(): number {
    return currentTotalWeight;
}

/**
 * Invoke the callback whenever inventory changes.
 *
 * @export
 * @param {ItemChangeCallback} callback
 */
export function onInventoryChange(callback: ItemChangeCallback) {
    inventoryChangeCbs.push(callback);
}

/**
 * Invoke the callback whenever the toolbar changes.
 *
 * @export
 * @param {ItemChangeCallback} callback
 */
export function onToolbarChange(callback: ItemChangeCallback) {
    toolbarChangeCbs.push(callback);
}

/**
 * Invoke the weight change whenever the total weight changes.
 *
 * @export
 * @param {WeightChangeCallback} callback
 */
export function onTotalWeightChange(callback: WeightChangeCallback) {
    weightChangeCbs.push(callback);
}

onInventoryUpdate.add((inventoryNew, toolbarNew, totalWeightNew) => {
    const oldInventory = JSON.stringify(currentInventory);
    const oldToolbar = JSON.stringify(currentToolbar);
    const oldWeight = currentTotalWeight;

    currentInventory = inventoryNew;
    currentToolbar = toolbarNew;
    currentTotalWeight = totalWeightNew;

    if (oldInventory !== JSON.stringify(currentInventory)) {
        for (let cb of inventoryChangeCbs) {
            cb(currentInventory);
        }
    }

    if (oldToolbar !== JSON.stringify(currentToolbar)) {
        for (let cb of toolbarChangeCbs) {
            cb(currentToolbar);
        }
    }

    if (oldWeight !== currentTotalWeight) {
        for (let cb of weightChangeCbs) {
            cb(currentTotalWeight);
        }
    }
});
