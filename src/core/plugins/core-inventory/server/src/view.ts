import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { INVENTORY_EVENTS } from '@AthenaPlugins/core-inventory/shared/events';
import { DualSlotInfo, InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces';
import { deepCloneArray, deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { StoredItem } from '@AthenaShared/interfaces/item';
import { INVENTORY_CONFIG } from '@AthenaPlugins/core-inventory/shared/config';

type PlayerCallback = (player: alt.Player) => void;
type PlayerCloseCallback = (player: alt.Player, uid: string, items: Array<StoredItem>) => void;

const openStorages: { [id: string]: Array<StoredItem> } = {};
const openStorageSessions: { [id: string]: string } = {};
const openCallbacks: Array<PlayerCallback> = [];
const closeCallbacks: Array<PlayerCloseCallback> = [];

const Internal = {
    callbacks: {
        open(player: alt.Player) {
            if (!player || !player.valid) {
                return;
            }

            for (let cb of openCallbacks) {
                cb(player);
            }
        },
        close(player: alt.Player) {
            console.log('1');

            if (!player || !player.valid) {
                return;
            }

            console.log('2');

            if (!openStorageSessions[player.id]) {
                return;
            }

            console.log('3');

            for (let cb of closeCallbacks) {
                cb(player, openStorageSessions[player.id], openStorages[player.id]);
            }

            delete openStorageSessions[player.id];
            delete openStorages[player.id];
        },
    },
    disconnect(player: alt.Player) {
        const id = player.id;
        if (typeof id === 'undefined') {
            return;
        }

        delete openStorages[id];
    },
    async use(player: alt.Player, type: InventoryType, slot: number) {
        if (type === 'custom') {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        Athena.systems.itemManager.utility.useItem(player, slot, type);
    },
    async drop(player: alt.Player, type: InventoryType, slot: number) {
        if (type === 'custom') {
            return;
        }
    },
    async split(player: alt.Player, type: InventoryType, slot: number, amount: number) {
        if (type === 'custom') {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        if (typeof data[type] === 'undefined') {
            return;
        }

        const newInventory = await Athena.systems.itemManager.slot.splitAt(slot, data[type], amount, type);
        if (typeof newInventory === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, type, newInventory);
    },
    async combine(player: alt.Player, info: DualSlotInfo) {
        if (info.startType !== 'inventory' || info.endType !== 'inventory') {
            return;
        }

        if (info.startType !== info.endType) {
            return;
        }

        if (info.startIndex === info.endIndex) {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        const newInventory = await Athena.systems.itemCrafting.items.combine(
            data.inventory,
            info.startIndex,
            info.endIndex,
            'inventory',
        );

        if (typeof newInventory === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, 'inventory', newInventory);
        Athena.player.emit.sound2D(
            player,
            `@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_combine.ogg`,
            0.2,
        );
    },
    async swap(player: alt.Player, info: DualSlotInfo) {
        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        let startData: Array<StoredItem> = data[info.startType];
        let endData: Array<StoredItem> = data[info.endType];

        if (info.startType === 'custom') {
            startData = openStorages[player.id];
        }

        if (info.endType === 'custom') {
            endData = openStorages[player.id];
        }

        if (typeof startData === 'undefined' || typeof endData === 'undefined') {
            return;
        }

        const startItem = Athena.systems.itemManager.slot.getAt(info.startIndex, startData);
        if (typeof startItem === 'undefined') {
            return;
        }

        const endItem = Athena.systems.itemManager.slot.getAt(info.endIndex, endData);

        // If its the same data set that we are modifying. Just does a simple combine for the same inventory type.
        // Stacking items in same data set.
        if (info.startType === info.endType && Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const newInventory = Athena.systems.itemManager.slot.combineAt(info.startIndex, info.endIndex, startData);
            if (typeof newInventory === 'undefined') {
                return;
            }

            if (info.startType === 'custom') {
                openStorages[player.id] = newInventory;
                InventoryView.storage.resync(player);
                return;
            }

            await Athena.document.character.set(player, info.startType, newInventory);
            return;
        }

        // Actually swapping different slots with same data set.
        // Same data set, different items.
        if (info.startType === info.endType && !Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const newInventory = Athena.systems.itemManager.slot.swap(info.startIndex, info.endIndex, startData);
            if (typeof newInventory === 'undefined') {
                return;
            }

            if (info.startType === 'custom') {
                openStorages[player.id] = newInventory;
                InventoryView.storage.resync(player);
                return;
            }

            await Athena.document.character.set(player, info.startType, newInventory);
            return;
        }

        // Swapping different slots with different data sets.
        if (info.startType !== info.endType && !Athena.systems.itemManager.utility.compare(startItem, endItem)) {
            const complexSwap = Athena.systems.itemManager.slot.swapBetween(
                { slot: info.startIndex, data: startData, size: info.startType, type: info.startType },
                { slot: info.endIndex, data: endData, size: info.endType, type: info.endType },
            );

            if (typeof complexSwap === 'undefined') {
                return;
            }

            if (info.startType !== 'custom' && info.endType !== 'custom') {
                await Athena.document.character.setBulk(player, {
                    [info.startType]: complexSwap.from,
                    [info.endType]: complexSwap.to,
                });
                return;
            }

            if (info.startType === 'custom') {
                openStorages[player.id] = complexSwap.from;
            } else {
                await Athena.document.character.set(player, info.startType, complexSwap.from);
            }

            if (info.endType === 'custom') {
                openStorages[player.id] = complexSwap.to;
            } else {
                await Athena.document.character.set(player, info.endType, complexSwap.to);
            }

            InventoryView.storage.resync(player);
            return;
        }

        // Stacking items in different data sets.
    },
    async unequip(player: alt.Player, slot: number) {
        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        if (typeof data.toolbar === 'undefined') {
            return;
        }

        const existingItem = Athena.systems.itemManager.slot.getAt(slot, data.toolbar);
        if (typeof existingItem === 'undefined') {
            return;
        }

        const itemClone = deepCloneObject<StoredItem>(existingItem);
        const openSlot = Athena.systems.itemManager.slot.findOpen('inventory', data.inventory);
        if (typeof openSlot === 'undefined') {
            return;
        }

        let inventoryClone = deepCloneArray<StoredItem>(data.inventory);
        itemClone.slot = openSlot;
        inventoryClone.push(itemClone);

        let toolbarClone = deepCloneArray<StoredItem>(data.toolbar);
        toolbarClone = Athena.systems.itemManager.slot.removeAt(slot, toolbarClone);
        if (typeof toolbarClone === 'undefined') {
            return;
        }

        await Athena.document.character.setBulk(player, {
            toolbar: toolbarClone,
            inventory: inventoryClone,
        });
    },
    async give(player: alt.Player) {
        //
    },
};

function addCallback(type: 'close', callback: PlayerCloseCallback);
function addCallback(type: 'open', callback: PlayerCallback);
function addCallback(type: 'open' | 'close', callback: PlayerCallback | PlayerCloseCallback) {
    if (type === 'open') {
        openCallbacks.push(callback as PlayerCallback);
        return;
    }

    if (type === 'close') {
        closeCallbacks.push(callback as PlayerCloseCallback);
        return;
    }
}

export const InventoryView = {
    init() {
        alt.on('playerDisconnect', Internal.disconnect);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.USE, Internal.use);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.DROP, Internal.drop);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SPLIT, Internal.split);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SWAP, Internal.swap);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.UNEQUIP, Internal.unequip);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.COMBINE, Internal.combine);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.OPEN, Internal.callbacks.open);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.CLOSE, Internal.callbacks.close);
    },
    callbacks: {
        add: addCallback,
    },
    controls: {
        /**
         * Force open an inventory.
         *
         * @param {alt.Player} player
         */
        open(player: alt.Player) {
            player.emit(INVENTORY_EVENTS.TO_CLIENT.OPEN);
        },
        /**
         * Force close the inventory if it is open.
         *
         * @param {alt.Player} player
         */
        close(player: alt.Player) {
            player.emit(INVENTORY_EVENTS.TO_CLIENT.CLOSE);
        },
    },
    storage: {
        /**
         * Allows opening a side-panel with an array of items next to the inventory.
         * The array of items will be returned through a callback.
         * Utilize the callback system to obtain the modified storage data.
         *
         * @param {alt.Player} player
         * @param {string} uid
         * @param {Array<StoredItem>} items
         */
        async open(
            player: alt.Player,
            uid: string,
            items: Array<StoredItem>,
            storageSize: number,
            forceOpenInventory = false,
        ) {
            if (forceOpenInventory) {
                player.emit(INVENTORY_EVENTS.TO_CLIENT.OPEN);
                await alt.Utils.wait(250);
            }

            // If the matching uid is already open; we do not open it for others.
            if (Object.values(openStorageSessions).includes(uid)) {
                return;
            }

            if (storageSize < items.length) {
                storageSize = items.length;
            }

            openStorages[player.id] = deepCloneArray<StoredItem>(items);
            openStorageSessions[player.id] = uid;
            const fullStorageList = Athena.systems.itemManager.inventory.convertFromStored(openStorages[player.id]);
            Athena.webview.emit(player, INVENTORY_EVENTS.TO_WEBVIEW.SET_CUSTOM, fullStorageList, storageSize);
        },
        /**
         * Updates a storage session with new data.
         *
         * @param {alt.Player} player
         * @param {Array<StoredItem>} items
         */
        resync(player: alt.Player) {
            if (!openStorages[player.id]) {
                return;
            }

            const fullStorageList = Athena.systems.itemManager.inventory.convertFromStored(openStorages[player.id]);
            Athena.webview.emit(player, INVENTORY_EVENTS.TO_WEBVIEW.SET_CUSTOM, fullStorageList);
        },
        /**
         * Returns true if a player is using the matching session uid.
         *
         * @param {alt.Player} player
         * @param {string} uid
         * @return {*}
         */
        isUsingSession(player: alt.Player, uid: string) {
            return openStorageSessions[player.id] === uid;
        },
        /**
         * Returns true if the session with a specific uid is in use.
         *
         * @param {string} uid
         * @return {*}
         */
        isSessionInUse(uid: string) {
            return Object.values(openStorageSessions).includes(uid);
        },
    },
};

function finishStorageMove(player: alt.Player, uid: string, items: Array<StoredItem>) {
    // Pretty much if the uid matches here; maybe that's a database location or something.
    // Then you perform your saving here.
    console.log(uid);
    console.log(items);
}

Athena.systems.messenger.commands.register('testinv', '/testinv', ['admin'], (player) => {
    const storedItems: Array<StoredItem> = [{ dbName: 'burger', quantity: 1, slot: 0, data: {} }];
    InventoryView.storage.open(player, 'storage-force-1', storedItems, 5, true);
});

InventoryView.callbacks.add('close', finishStorageMove);
