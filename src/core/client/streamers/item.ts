import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { ItemDrop } from '@AthenaShared/interfaces/item.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';
import { ITEM_SYNCED_META } from '@AthenaShared/enums/syncedMeta.js';

export type CreatedDrop = ItemDrop & { createdObject?: alt.Entity };

let maxDistance = 5;
let items: Array<CreatedDrop> = [];
let closestItems: Array<CreatedDrop> = [];
let interval: number;

/**
 * Do Not Export Internal Only
 */
const InternalFunctions = {
    init() {
        items = [];
    },

    stop() {
        if (!interval) {
            return;
        }

        alt.clearInterval(interval);
    },
    start() {
        if (!interval) {
            interval = alt.setInterval(InternalFunctions.handleDrawItems, 0);
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
        let startDistance = 10;
        for (let i = 0; i < items.length; i++) {
            if (!maxDistance) {
                maxDistance = 25;
            }

            const dist = AthenaClient.utility.vector.distance2d(alt.Player.local.pos, items[i].pos);
            if (dist > maxDistance) {
                continue;
            }

            // Used to lower the distance checks between items.
            if (dist <= startDistance) {
                AthenaClient.screen.text.drawText3D(
                    `~y~${items[i].name} (x${items[i].quantity})`,
                    items[i].pos,
                    0.4,
                    new alt.RGBA(255, 255, 255, 255),
                );
            }

            itemsCloseToPlayer.push(items[i]);
        }

        closestItems = itemsCloseToPlayer;
    },
};

function onEntityCreate(entity: alt.Entity) {
    if (!(entity instanceof alt.Entity)) {
        return;
    }

    if (!entity.hasStreamSyncedMeta(ITEM_SYNCED_META.ITEM_DROP_INFO)) {
        return;
    }

    const info = entity.getStreamSyncedMeta(ITEM_SYNCED_META.ITEM_DROP_INFO) as ItemDrop;
    if (!info) {
        return;
    }

    const index = items.findIndex((x) => x._id === info._id);
    if (index >= 1) {
        return;
    }

    items.push({ ...info, createdObject: entity });
}

function onEntityRemoved(entity: alt.Entity) {
    if (!(entity instanceof alt.Entity)) {
        return;
    }

    if (!entity.hasStreamSyncedMeta(ITEM_SYNCED_META.ITEM_DROP_INFO)) {
        return;
    }

    const info = entity.getStreamSyncedMeta(ITEM_SYNCED_META.ITEM_DROP_INFO) as ItemDrop;
    if (!info) {
        return;
    }

    for (let i = items.length - 1; i >= 0; i--) {
        if (items[i]._id !== info._id) {
            continue;
        }

        items.splice(i, 1);
        break;
    }
}

alt.on('gameEntityCreate', onEntityCreate);
alt.on('gameEntityDestroy', onEntityRemoved);
alt.on('baseObjectRemove', onEntityRemoved);

/**
 * Return an array of items that are closest to the player.
 *
 * @static
 * @return {Array<ItemDrop>}
 *
 */
export function getClosest(): Array<ItemDrop> {
    return closestItems;
}

/**
 * Set the maximum distance a player can see item drops.
 *
 * @param {number} [distance=5]
 */
export function setDefaultMaxDistance(distance = 5) {
    maxDistance = distance;
}

/**
 * Determine if this alt.Object is an item drop.
 *
 * @param {number} id
 * @return {(CreatedDrop | undefined)}
 */
export function getDropped(id: number): CreatedDrop | undefined {
    return closestItems.find((x) => x.createdObject && x.createdObject.remoteID === id);
}

alt.on('connectionComplete', InternalFunctions.init);
alt.on('disconnect', InternalFunctions.stop);
onTicksStart.add(InternalFunctions.start);
