import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { INVENTORY_EVENTS } from '@AthenaPlugins/core-inventory/shared/events';

type InventoryType = 'inventory' | 'toolbar';

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
    async swap(
        player: alt.Player,
        startType: InventoryType,
        startIndex: number,
        endType: InventoryType,
        endIndex: number,
    ) {
        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        if (typeof data[startType] === 'undefined' || typeof data[endType] === 'undefined') {
            return;
        }

        const startItem = Athena.systems.itemManager.slot.getAt(startIndex, data[startType]);
        if (typeof startItem === 'undefined') {
            return;
        }

        const endItem = Athena.systems.itemManager.slot.getAt(endIndex, data[endType]);

        // If its the same data set that we are modifying. Just does a simple combine for the same inventory type.
        // Stacking items in same data set.
        if (startType === endType && Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const newInventory = Athena.systems.itemManager.slot.combineAt(startIndex, endIndex, data[startType]);
            if (typeof newInventory === 'undefined') {
                return;
            }

            await Athena.document.character.set(player, startType, newInventory);
            return;
        }

        // Actually swapping different slots with same data set.
        // Same data set, different items.
        if (startType === endType && !Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const newInventory = Athena.systems.itemManager.slot.swap(startIndex, endIndex, data[startType]);
            if (typeof newInventory === 'undefined') {
                return;
            }

            await Athena.document.character.set(player, startType, newInventory);
            return;
        }

        // Swapping different slots with different data sets.
        if (startType !== endType && !Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const complexSwap = Athena.systems.itemManager.slot.swapBetween(
                { slot: startIndex, data: data[startType], size: startType, type: startType },
                { slot: endIndex, data: data[endType], size: endType, type: endType },
            );

            if (typeof complexSwap === 'undefined') {
                return;
            }

            await Athena.document.character.setBulk(player, {
                [startType]: complexSwap.from,
                [endType]: complexSwap.to,
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
