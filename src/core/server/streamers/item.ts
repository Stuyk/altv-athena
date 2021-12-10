import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';
import { GroundItem } from '../../shared/interfaces/GroundItem';

const globalItemDrops: Array<GroundItem> = [];
const KEY = 'item-drops';

export class ServerItemController {
    static init() {
        StreamerService.registerCallback(KEY, ServerItemController.update);
    }

    static refresh() {
        StreamerService.updateData(KEY, globalItemDrops);
    }

    static append(itemInfo: GroundItem): string {
        if (!itemInfo.uid) {
            itemInfo.uid = sha256Random(JSON.stringify(itemInfo));
        }

        globalItemDrops.push(itemInfo);
        ServerItemController.refresh();
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

        ServerItemController.refresh();
        return true;
    }

    static update(player: alt.Player, drops: Array<GroundItem>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_ITEM_DROPS, drops);
    }
}

ServerItemController.init();
