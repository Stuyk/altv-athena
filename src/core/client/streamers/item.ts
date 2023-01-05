import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { GroundItem } from '@AthenaShared/interfaces/groundItem';
import { distance2d } from '@AthenaShared/utility/vector';
import { Timer } from '@AthenaClient/utility/timers';
import { drawText3D } from '@AthenaClient/utility/text';

let closestItems: Array<GroundItem> = [];
let addedItems: Array<GroundItem> = [];
let interval: number;

/**
 * Do Not Export Internal Only
 */
const InternalFunctions = {
    init() {
        addedItems = [];
        closestItems = [];
    },

    stop() {
        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    },

    populate(items: Array<GroundItem>) {
        addedItems = items;

        if (items.length <= 0) {
            closestItems = [];
        }

        if (!interval) {
            interval = Timer.createInterval(InternalFunctions.handleDrawItems, 0, 'item.ts');
        }
    },

    handleDrawItems() {
        if (alt.Player.local.isWheelMenuOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.meta.isDead) {
            return;
        }

        let itemsCloseToPlayer = [];
        let startDistance = 3;
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
            if (dist <= startDistance) {
                drawText3D(
                    `~y~${groundItem.item.item.name} (x${groundItem.item.item.quantity})`,
                    groundItem.item.position,
                    0.4,
                    new alt.RGBA(255, 255, 255, 255),
                );
            }

            itemsCloseToPlayer.push(groundItem);
        }

        closestItems = itemsCloseToPlayer;
    },
};

export const ClientItemStreamer = {
    /**
     * Return an array of items that are closest to the player.
     *
     * @static
     * @return {Array<GroundItem>}
     * @memberof ClientItemStreamer
     */
    getClosestItems(): Array<GroundItem> {
        return closestItems;
    },
};

alt.on('connectionComplete', InternalFunctions.init);
alt.on('disconnect', InternalFunctions.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEM_DROPS, InternalFunctions.populate);
