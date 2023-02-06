import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { StreamerService } from '../systems/streamer';
import { ItemDrop } from '@AthenaShared/interfaces/item';

const KEY = 'item-drops';
const globalDrops: Array<ItemDrop> = [];

const InternalController = {
    async init() {
        StreamerService.registerCallback(KEY, InternalController.update);
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
     * Append door information to be controlled.
     * Returns the door uid to remove all door controls if necessary.
     *
     * @param {Door} door
     * @return {string}
     */
    append(itemDrop: ItemDrop): string {
        globalDrops.push(itemDrop);
        InternalController.refresh();
        return String(itemDrop._id);
    },
    /**
     * Remove all controls from a door.
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
