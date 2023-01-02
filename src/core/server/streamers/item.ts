import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { sha256Random } from '@AthenaServer/utility/encryption';
import { StreamerService } from '@AthenaServer/systems/streamer';
import { GroundItem } from '@AthenaShared/interfaces/groundItem';

const globalItemDrops: Array<GroundItem> = [];
const KEY = 'item-drops';

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
const InternalController = {
    init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    },
    refresh() {
        StreamerService.updateData(KEY, globalItemDrops);
    },
    update(player: alt.Player, drops: Array<GroundItem>) {
        const dropsInPlayersDimension = drops.filter((item) => item.item.dimension === player.dimension);
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_ITEM_DROPS, dropsInPlayersDimension);
    },
};

const ServerItemControllerConst = {
    append(itemInfo: GroundItem): string {
        if (!itemInfo.uid) {
            itemInfo.uid = sha256Random(JSON.stringify(itemInfo));
        }

        globalItemDrops.push(itemInfo);
        InternalController.refresh();
        return itemInfo.uid;
    },

    remove(uid: string): boolean {
        let wasFound = false;
        for (let i = globalItemDrops.length - 1; i >= 0; i--) {
            if (globalItemDrops[i].uid !== uid) {
                continue;
            }

            globalItemDrops.splice(i, 1);
            wasFound = true;
        }

        if (!wasFound) {
            return false;
        }

        InternalController.refresh();
        return true;
    },
};

export const ServerItemController = {
    ...ServerItemControllerConst,
};

InternalController.init();
