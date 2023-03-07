import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ItemDrop } from '@AthenaShared/interfaces/item';

const KEY = 'item-drops';
const globalDrops: Array<ItemDrop> = [];
const MAX_DISTANCE = 25;

const InternalController = {
    async init() {
        Athena.systems.streamer.registerCallback(KEY, InternalController.update, MAX_DISTANCE);
        InternalController.refresh();
    },
    refresh() {
        Athena.systems.streamer.updateData(KEY, globalDrops);
    },
    update(player: alt.Player, drops: Array<ItemDrop>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_ITEM_DROPS, drops);
    },
};

/**
 * Append item drop information to the server.
 *
 * Do not use this for creating item drops the players can pickup.
 *
 * These are mostly visual. Refer to `Athena.systems.inventory.drops` to make actual item drops.
 *
 * Returns a uid or generates one if not specified.
 *
 *
 * @param {ItemDrop} itemDrop
 * @return {string}
 */
export function append(itemDrop: ItemDrop): string {
    if (Overrides.append) {
        return Overrides.append(itemDrop);
    }

    globalDrops.push(itemDrop);
    InternalController.refresh();
    return String(itemDrop._id);
}

/**
 * Removes an item drop in-world.
 *
 * @param {string} uid
 * @return {boolean}
 */
export function remove(id: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(id);
    }

    const index = globalDrops.findIndex((label) => label._id === id);
    if (index <= -1) {
        return false;
    }

    globalDrops.splice(index, 1);
    InternalController.refresh();
    return true;
}

InternalController.init();

type ItemDropFuncs = ControllerFuncs<typeof append, typeof remove>;

const Overrides: Partial<ItemDropFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
/**
 * Used to override any item drop streamer functionality.
 *
 * @export
 * @param {keyof ItemDropFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof ItemDropFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
