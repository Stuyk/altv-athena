import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { INVENTORY_EVENTS } from '@AthenaPlugins/core-inventory/shared/events';
import { DualSlotInfo, InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces';

const Internal = {
    async use(player: alt.Player, type: InventoryType, slot: number) {
        //
    },
    async drop(player: alt.Player, type: InventoryType, slot: number) {
        //
    },
    async split(player: alt.Player, type: InventoryType, slot: number) {
        //
    },
    async combine(player: alt.Player, info: DualSlotInfo) {
        //
    },
    async swap(player: alt.Player, info: DualSlotInfo) {
        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        if (typeof data[info.startType] === 'undefined' || typeof data[info.endType] === 'undefined') {
            return;
        }

        const startItem = Athena.systems.itemManager.slot.getAt(info.startIndex, data[info.startType]);
        if (typeof startItem === 'undefined') {
            return;
        }

        const endItem = Athena.systems.itemManager.slot.getAt(info.endIndex, data[info.endType]);

        // If its the same data set that we are modifying. Just does a simple combine for the same inventory type.
        // Stacking items in same data set.
        if (info.startType === info.endType && Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const newInventory = Athena.systems.itemManager.slot.combineAt(
                info.startIndex,
                info.endIndex,
                data[info.startType],
            );
            if (typeof newInventory === 'undefined') {
                return;
            }

            await Athena.document.character.set(player, info.startType, newInventory);
            return;
        }

        // Actually swapping different slots with same data set.
        // Same data set, different items.
        if (info.startType === info.endType && !Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const newInventory = Athena.systems.itemManager.slot.swap(
                info.startIndex,
                info.endIndex,
                data[info.startType],
            );
            if (typeof newInventory === 'undefined') {
                return;
            }

            await Athena.document.character.set(player, info.startType, newInventory);
            return;
        }

        // Swapping different slots with different data sets.
        if (info.startType !== info.endType && !Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const complexSwap = Athena.systems.itemManager.slot.swapBetween(
                { slot: info.startIndex, data: data[info.startType], size: info.startType, type: info.startType },
                { slot: info.endIndex, data: data[info.endType], size: info.endType, type: info.endType },
            );

            if (typeof complexSwap === 'undefined') {
                return;
            }

            await Athena.document.character.setBulk(player, {
                [info.startType]: complexSwap.from,
                [info.endType]: complexSwap.to,
            });
            return;
        }

        // Stacking items in different data sets.
    },
    async unequip(player: alt.Player, slot: number) {
        //
    },
    async give(player: alt.Player) {
        //
    },
};

export const InventoryView = {
    init() {
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.USE, Internal.use);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.DROP, Internal.drop);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SPLIT, Internal.split);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SWAP, Internal.swap);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.UNEQUIP, Internal.unequip);
    },
};
