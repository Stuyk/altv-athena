import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { StreamerService } from '../systems/streamer';
import { ItemDrop } from '@AthenaShared/interfaces/item';

const KEY = 'item-drops';
const globalDrops: Array<ItemDrop> = [];
const MAX_DISTANCE = 25;

const InternalController = {
    async init() {
        StreamerService.registerCallback(KEY, InternalController.update, MAX_DISTANCE);
        InternalController.refresh();
    },
    refresh() {
        StreamerService.updateData(KEY, globalDrops);
    },
    update(player: alt.Player, drops: Array<ItemDrop>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_ITEM_DROPS, drops);
    },
};

const ItemDropsConst = {
    /**
     * Append item drop information to the server.
     *
     * @param {ItemDrop} itemDrop
     * @return {string}
     */
    append(itemDrop: ItemDrop): string {
        globalDrops.push(itemDrop);
        InternalController.refresh();
        return String(itemDrop._id);
    },
    /**
     * Removes an item drop.
     *
     * @param {string} uid
     * @return {boolean}
     */
    remove(id: string): boolean {
        const index = globalDrops.findIndex((label) => label._id === id);
        if (index <= -1) {
            return false;
        }

        globalDrops.splice(index, 1);
        InternalController.refresh();
        return true;
    },
};

export const ItemDropsController = {
    ...ItemDropsConst,
};

InternalController.init();
