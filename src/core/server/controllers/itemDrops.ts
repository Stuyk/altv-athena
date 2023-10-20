import * as alt from 'alt-server';
import { ItemDrop } from '@AthenaShared/interfaces/item.js';
import { ITEM_SYNCED_META } from '@AthenaShared/enums/syncedMeta.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';
import { ControllerFuncs } from './shared.js';

const drops: { [uid: string]: alt.Object } = {};

let defaultModel = 'prop_cs_cardbox_01';

/**
 * Append item drop information to the server.
 *
 * Do not use this for creating item drops the players can pickup.
 *
 * These are mostly visual. Refer to `Athena.systems.inventory.drops` to make actual item drops.
 *
 * Returns a uid or generates one if not specified.
 *
 * @param {ItemDrop} itemDrop
 * @return {string}
 */
export function append(itemDrop: ItemDrop): string {
    if (Overrides.append) {
        return Overrides.append(itemDrop);
    }

    const object = new alt.Object(itemDrop.model ? itemDrop.model : defaultModel, itemDrop.pos, alt.Vector3.zero);
    object.frozen = true;
    object.collision = false;
    object.setStreamSyncedMeta(ITEM_SYNCED_META.ITEM_DROP_INFO, deepCloneObject(itemDrop));
    drops[String(itemDrop._id)] = object;
    return String(itemDrop._id);
}

/**
 * Removes an item drop in-world.
 *
 * @param {string} uid A unique string
 * @return {boolean}
 */
export function remove(id: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(id);
    }

    if (!drops[id]) {
        return false;
    }

    try {
        drops[id].destroy();
    } catch (err) {}

    return true;
}

/**
 * Overrides the default model for item drops.
 * By default it is a cardboard box.
 *
 * @param {string} model
 */
export function setDefaultDropModel(model: string) {
    defaultModel = model;
}

type ItemDropFuncs = ControllerFuncs<typeof append, typeof remove>;

const Overrides: Partial<ItemDropFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
/**
 * Used to override any item drop streamer functionality.
 *
 *
 * @param {keyof ItemDropFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof ItemDropFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
