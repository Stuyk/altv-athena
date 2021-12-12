import * as native from 'natives';
import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { GroundItem } from '../../shared/interfaces/GroundItem';
import { distance2d } from '../../shared/utility/vector';
import { Timer } from '../utility/timers';
import { drawText3D } from '../utility/text';

let addedItems: Array<GroundItem> = [];
let interval: number;

/**
 * Do Not Export Internal Only
 */
class ClientItemStreamer {
    static init() {
        addedItems = [];
    }

    static stop() {
        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    }

    static populate(items: Array<GroundItem>) {
        addedItems = items;

        if (items.length <= 0) {
            alt.Player.local.closestItem = null;
        }

        if (!interval) {
            interval = Timer.createInterval(ClientItemStreamer.handleDrawItems, 0, 'item.ts');
        }
    }

    static handleDrawItems() {
        if (alt.Player.local.isWheelMenuOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.meta.isDead) {
            return;
        }

        let startDistance = 3;
        let closestItem: GroundItem | null = null;
        let closestItemText = null;
        for (let i = 0; i < addedItems.length; i++) {
            const groundItem = addedItems[i];
            if (!groundItem.maxDistance) {
                groundItem.maxDistance = 25;
            }

            const dist = distance2d(alt.Player.local.pos, groundItem.item.position);
            if (dist > groundItem.maxDistance) {
                continue;
            }

            // Used to lower the distance checks between items.
            if (dist < startDistance) {
                closestItem = groundItem;
                startDistance = dist;
                closestItemText = `~y~${groundItem.item.item.name} (x${groundItem.item.item.quantity})`;
            }
        }

        if (closestItemText) {
            drawText3D(closestItemText, closestItem.item.position, 0.4, new alt.RGBA(255, 255, 255, 255));
        }

        alt.Player.local.closestItem = closestItem;
    }
}

alt.on('connectionComplete', ClientItemStreamer.init);
alt.on('disconnect', ClientItemStreamer.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEM_DROPS, ClientItemStreamer.populate);
