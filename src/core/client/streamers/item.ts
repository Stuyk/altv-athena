import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { distance2d } from '@AthenaShared/utility/vector';
import { Timer } from '@AthenaClient/utility/timers';
import { drawText3D } from '@AthenaClient/utility/text';
import { ItemDrop } from '@AthenaShared/interfaces/item';

type CreatedDrop = ItemDrop & { createdObject?: alt.Object };

let maxDistance = 5;
let defaultProp = 'prop_cs_cardbox_01';
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

        Timer.clearInterval(interval);
    },

    populate(itemDrops: Array<ItemDrop>) {
        // First Loop Clears Uncommon Values
        for (var i = items.length - 1; i >= 0; i--) {
            if (itemDrops.findIndex((x) => x._id === items[i]._id)) {
                continue;
            }

            if (typeof items[i].createdObject === 'undefined') {
                continue;
            }

            if (items[i].createdObject.valid) {
                items[i].createdObject.destroy();
            }

            items.splice(i, 1);
        }

        // Second Loop Creates New Objects
        for (var i = items.length - 1; i >= 0; i--) {
            if (typeof items[i].createdObject !== 'undefined') {
                continue;
            }

            items[i].createdObject = new alt.Object(
                items[i].model ? items[i].model : defaultProp,
                new alt.Vector3(items[i].pos),
                new alt.Vector3(0, 0, 0),
                true,
                false,
            );

            items[i].createdObject.toggleCollision(false, false);
            items[i].createdObject.setPositionFrozen(true);
        }

        items = itemDrops;

        if (!interval) {
            interval = Timer.createInterval(InternalFunctions.handleDrawItems, 0, 'item.ts');
        }

        if (alt.debug) {
            if (items.length >= 1) {
                alt.log(`~g~Item Drops Found: ${items.length}`);
            }
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
        for (let i = 0; i < items.length; i++) {
            if (!maxDistance) {
                maxDistance = 25;
            }

            const dist = distance2d(alt.Player.local.pos, items[i].pos);
            if (dist > maxDistance) {
                continue;
            }

            // Used to lower the distance checks between items.
            if (dist <= startDistance) {
                drawText3D(
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

export const ClientItemDrops = {
    /**
     * Return an array of items that are closest to the player.
     *
     * @static
     * @return {Array<ItemDrop>}
     * @memberof ClientItemDrops
     */
    getClosestItems(): Array<ItemDrop> {
        return closestItems;
    },
    /**
     * Overrides the default model for item drops.
     * By default it is a cardboard box.
     *
     * @param {string} model
     */
    setDefaultDropModel(model: string) {
        defaultProp = model;
    },
    /**
     * Set the maximum distance a player can see item drops.
     *
     * @param {number} [distance=5]
     */
    setDefaultMaxDistance(distance = 5) {
        maxDistance = distance;
    },
};

alt.on('connectionComplete', InternalFunctions.init);
alt.on('disconnect', InternalFunctions.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEM_DROPS, InternalFunctions.populate);
