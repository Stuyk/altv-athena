import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';
import { GroundItem } from '../../shared/interfaces/groundItem';

const globalItemDrops: Array<GroundItem> = [];
const KEY = 'item-drops';

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
class InternalController {
    static init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    }

    static refresh() {
        StreamerService.updateData(KEY, globalItemDrops);
    }

    static update(player: alt.Player, drops: Array<GroundItem>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_ITEM_DROPS, drops);
    }
}

export class ServerItemController {
    static append(itemInfo: GroundItem): string {
        if (!itemInfo.uid) {
            itemInfo.uid = sha256Random(JSON.stringify(itemInfo));
        }

        globalItemDrops.push(itemInfo);
        InternalController.refresh();
        return itemInfo.uid;
    }

    static remove(uid: string): boolean {
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
    }
}

InternalController.init();
