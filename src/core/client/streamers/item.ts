import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { distance2d } from '@AthenaShared/utility/vector';
import { Timer } from '@AthenaClient/utility/timers';
import { drawText3D } from '@AthenaClient/utility/text';
import { ItemDrop } from '@AthenaShared/interfaces/item';
import { getGroundPosition } from '@AthenaClient/utility/groundPositionHelper';

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
        for (let i = items.length - 1; i >= 0; i--) {
            if (itemDrops.findIndex((x) => x._id === items[i]._id) >= 0) {
                continue;
            }

            if (items[i].createdObject) {
                items[i].createdObject.destroy();
            }

            items.splice(i, 1);
        }

        // Second loop pushes items that do not exist and creates items that have not been created
        for (let i = 0; i < itemDrops.length; i++) {
            let existingIndex = items.findIndex((x) => x._id === itemDrops[i]._id);
            if (existingIndex <= -1) {
                items.push(itemDrops[i]);
                existingIndex = items.length - 1;
            }

            if (items[existingIndex].createdObject) {
                continue;
            }

            const model = items[existingIndex].model ? items[existingIndex].model : defaultProp;
            const [_, min, max] = native.getModelDimensions(alt.hash(model));
            const itemHeight = (Math.abs(min.z) + Math.abs(max.z)) / 2;
            const modifiedPosition = getGroundPosition(items[existingIndex].pos);
            const itemPosition = new alt.Vector3(
                modifiedPosition.x,
                modifiedPosition.y,
                modifiedPosition.z + itemHeight,
            );

            items[existingIndex].createdObject = new alt.Object(
                model,
                itemPosition,
                new alt.Vector3(0, 0, 0),
                true,
                false,
            );
            items[existingIndex].createdObject.toggleCollision(false, false);
            items[existingIndex].createdObject.setPositionFrozen(true);
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
        let startDistance = 10;
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
    /**
     * Determine if this alt.Object is an item drop.
     *
     * @param {number} id
     * @return {(CreatedDrop | undefined)}
     */
    getDroppedItem(id: number): CreatedDrop | undefined {
        return closestItems.find((x) => x.createdObject && x.createdObject.scriptID === id);
    },
};

alt.on('connectionComplete', InternalFunctions.init);
alt.on('disconnect', InternalFunctions.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEM_DROPS, InternalFunctions.populate);
