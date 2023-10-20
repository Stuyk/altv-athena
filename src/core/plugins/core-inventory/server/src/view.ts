import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api/index.js';
import { INVENTORY_EVENTS } from '@AthenaPlugins/core-inventory/shared/events.js';
import { DualSlotInfo, InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces.js';
import { deepCloneArray, deepCloneObject } from '@AthenaShared/utility/deepCopy.js';
import { ItemDrop, StoredItem } from '@AthenaShared/interfaces/item.js';
import { INVENTORY_CONFIG } from '@AthenaPlugins/core-inventory/shared/config.js';
import { ComplexSwapReturn } from '@AthenaServer/systems/inventory/manager.js';

type PlayerCallback = (player: alt.Player) => void;
type PlayerCloseCallback = (uid: string, items: Array<StoredItem>, player: alt.Player | undefined) => void;
type OfferInfo = {
    to: number | string;
    from: number | string;
    slot: number;
    quantity: number;
    dbName: string;
    creation?: number;
};

const EVENTS = {
    ACCEPT: 'inventory-accept-offer',
    DECLINE: 'inventory-decline-offer',
};

// Give Offers
const offers: { [hash: string]: OfferInfo } = {};

// Storages
const openStorages: { [player_id: string]: Array<StoredItem> } = {};
const openStorageSessions: { [player_id: string]: string } = {};
const openStoragesWeight: { [player_id: string]: number } = {};

// Callbacks
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
        close(player: alt.Player | number) {
            let id = -1;
            if (typeof player !== 'number') {
                if (!player || !player.valid) {
                    return;
                }

                id = player.id;
            } else {
                id = player;
            }

            if (!openStorageSessions[id]) {
                return;
            }

            for (let cb of closeCallbacks) {
                cb(openStorageSessions[id], openStorages[id], typeof player === 'number' ? undefined : player);
            }

            delete openStorageSessions[id];
            delete openStorages[id];
            delete openStoragesWeight[id];
        },
    },
    disconnect(player: alt.Player) {
        const id = player.id;
        if (typeof id === 'undefined') {
            return;
        }

        Internal.callbacks.close(id);
    },
    async use(player: alt.Player, type: InventoryType, slot: number, eventToCall: string | string[] = undefined) {
        if (type === 'custom') {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        Athena.systems.inventory.manager.useItem(player, slot, type, eventToCall);
    },
    async drop(player: alt.Player, type: InventoryType, slot: number) {
        if (type === 'custom') {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined' || typeof data[type] === 'undefined') {
            return;
        }

        const clonedItem = deepCloneObject<StoredItem>(Athena.systems.inventory.slot.getAt(slot, data[type]));
        const baseItem = Athena.systems.inventory.factory.getBaseItem(clonedItem.dbName, clonedItem.version);
        if (typeof baseItem === 'undefined') {
            return;
        }

        if (!baseItem.behavior.canDrop) {
            return;
        }

        if (baseItem.behavior.destroyOnDrop) {
            Athena.player.emit.notification(player, `${baseItem.name} was destroyed on drop.`);
            return;
        }

        const newDataSet = Athena.systems.inventory.slot.removeAt(slot, data[type]);
        if (typeof newDataSet === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, type, newDataSet);
        await Athena.systems.inventory.drops.add(
            clonedItem,
            new alt.Vector3(player.pos.x, player.pos.y, player.pos.z - 1),
            player,
        );
    },
    /**
     * Using the split interface; the result will try to push this.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {InventoryType} type
     * @param {number} slot
     * @param {number} amount
     * @return {void}
     */
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

        const newInventory = await Athena.systems.inventory.manager.splitAt(slot, data[type], amount, type);
        if (typeof newInventory === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, type, newInventory);
    },
    /**
     * Attempt to combine two items by left-clicking both of them in an inventory.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {DualSlotInfo} info
     * @return {void}
     */
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

        const result = await Athena.systems.inventory.crafting.combineItems(
            data.inventory,
            info.startIndex,
            info.endIndex,
            'inventory',
        );

        if (typeof result === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, 'inventory', result.dataSet);
        if (result.sound) {
            Athena.player.emit.sound2D(player, result.sound, 0.2);
        } else {
            Athena.player.emit.sound2D(
                player,
                `@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_combine.ogg`,
                0.2,
            );
        }
    },
    /**
     * Swaps items between slots. Handles the 'dragging' action.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {DualSlotInfo} info
     * @return {void}
     */
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

        const startItem = Athena.systems.inventory.slot.getAt(info.startIndex, startData);
        if (typeof startItem === 'undefined') {
            return;
        }

        const endItem = Athena.systems.inventory.slot.getAt(info.endIndex, endData);

        // If its the same data set that we are modifying. Just does a simple combine for the same inventory type.
        // Stacking items in same data set.
        if (info.startType === info.endType && Athena.systems.inventory.manager.compare(startItem, endItem)) {
            const newInventory = Athena.systems.inventory.manager.combineAt(info.startIndex, info.endIndex, startData);
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
        if (info.startType === info.endType && !Athena.systems.inventory.manager.compare(startItem, endItem)) {
            const newInventory = Athena.systems.inventory.manager.swap(info.startIndex, info.endIndex, startData);
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

        const fromComplex = { slot: info.startIndex, data: startData, size: info.startType, type: info.startType };
        const toComplex = { slot: info.endIndex, data: endData, size: info.endType, type: info.endType };

        let complexSwap: ComplexSwapReturn;

        if (info.startType !== info.endType && !Athena.systems.inventory.manager.compare(startItem, endItem)) {
            // Swapping different slots with different data sets.
            complexSwap = Athena.systems.inventory.manager.swapBetween(fromComplex, toComplex);
        } else {
            // Items match; but different data sets. Move stack sizes.
            complexSwap = Athena.systems.inventory.manager.combineAtComplex(
                { slot: info.startIndex, data: startData, size: info.startType, type: info.startType },
                { slot: info.endIndex, data: endData, size: info.endType, type: info.endType },
            );
        }

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

        // Check Storage Capacity
        const config = Athena.systems.inventory.config.get();

        if (config.weight.enabled) {
            const storageWeight = openStoragesWeight[player.id];
            const maxWeight = info.endType === 'custom' ? storageWeight : config.weight.player;
            if (Athena.systems.inventory.weight.isWeightExceeded([complexSwap.to], maxWeight)) {
                InventoryView.storage.resync(player);
                return;
            }
        }

        // Assign Data
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
    },
    /**
     * Unequip an item from a toolbar. Usually provoked by right-clicking in a toolbar.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {number} slot
     * @return {void}
     */
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

        const existingItem = Athena.systems.inventory.slot.getAt(slot, data.toolbar);
        if (typeof existingItem === 'undefined') {
            return;
        }

        const itemClone = deepCloneObject<StoredItem>(existingItem);
        const openSlot = Athena.systems.inventory.slot.findOpen('inventory', data.inventory);
        if (typeof openSlot === 'undefined') {
            return;
        }

        let inventoryClone = deepCloneArray<StoredItem>(data.inventory);
        itemClone.slot = openSlot;
        inventoryClone.push(itemClone);

        let toolbarClone = deepCloneArray<StoredItem>(data.toolbar);
        toolbarClone = Athena.systems.inventory.slot.removeAt(slot, toolbarClone);
        if (typeof toolbarClone === 'undefined') {
            return;
        }

        await Athena.document.character.setBulk(player, {
            toolbar: toolbarClone,
            inventory: inventoryClone,
        });
    },
    /**
     * Creates a 'give' request that the target player must accept to recieve an item.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {InventoryType} type
     * @param {number} slot
     * @param {number} idOfTarget
     * @return {void}
     */
    async give(player: alt.Player, type: InventoryType, slot: number, idOfTarget: number) {
        if (type !== 'inventory') {
            return;
        }

        if (typeof idOfTarget === 'undefined') {
            return;
        }

        const target = Athena.systems.identifier.getPlayer(idOfTarget);
        if (!target || !target.valid) {
            return;
        }

        if (target.id === player.id) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        if (typeof data.inventory === 'undefined' || data.inventory.length <= 0) {
            return;
        }

        const existingItem = Athena.systems.inventory.slot.getAt(slot, data.inventory);
        if (typeof existingItem === 'undefined') {
            return;
        }

        const baseItem = Athena.systems.inventory.factory.getBaseItem(existingItem.dbName, existingItem.version);
        if (typeof baseItem === 'undefined') {
            return;
        }

        const idOfOfferer = Athena.systems.identifier.getIdByStrategy(player);
        const newOffer: OfferInfo = {
            dbName: existingItem.dbName,
            quantity: existingItem.quantity,
            slot: existingItem.slot,
            from: idOfOfferer,
            to: idOfTarget,
        };

        const uid = Athena.utility.hash.sha256(JSON.stringify(newOffer));
        newOffer.creation = Date.now();
        offers[uid] = newOffer;

        const offerInfo = `Item Offer '${baseItem.name}' x${existingItem.quantity}`;
        Athena.player.emit.acceptDeclineEvent(target, {
            question: offerInfo,
            onClientEvents: {
                accept: EVENTS.ACCEPT,
                decline: EVENTS.DECLINE,
            },
            data: {
                uid,
            },
        });

        Athena.player.emit.notification(player, offerInfo.replace('Item Offer', 'Offered'));
    },
    async giveAccept(target: alt.Player, data: { uid: string }) {
        const offer = offers[data.uid];
        if (typeof offer === 'undefined') {
            Athena.player.emit.notification(target, `Item offer was not found.`);
            return;
        }

        const player = Athena.systems.identifier.getPlayer(offer.from);
        if (typeof player === 'undefined') {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `Item offer was not found.`);
            return;
        }

        const playerData = Athena.document.character.get(player);
        if (typeof playerData === 'undefined' || typeof playerData.inventory === 'undefined') {
            return;
        }

        const existingItem = Athena.systems.inventory.slot.getAt(offer.slot, playerData.inventory);
        if (typeof existingItem === 'undefined') {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `Item offer was not found.`);
            return;
        }

        if (existingItem.dbName !== offer.dbName || existingItem.quantity !== offer.quantity) {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `Item offer is no longer valid.`);
            return;
        }

        const targetData = Athena.document.character.get(target);
        if (typeof targetData === 'undefined' || typeof targetData.inventory === 'undefined') {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `Item offer is no longer valid.`);
            return;
        }

        const openSlot = Athena.systems.inventory.slot.findOpen('inventory', targetData.inventory);
        if (typeof openSlot === 'undefined') {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `No space in inventory.`);
            return;
        }

        const itemClone = deepCloneObject<StoredItem>(existingItem);
        const playerInventory = Athena.systems.inventory.slot.removeAt(offer.slot, playerData.inventory);
        if (typeof playerInventory === 'undefined') {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `Trade could not be completed.`);
            return;
        }

        const targetInventory = Athena.systems.inventory.manager.add(itemClone, targetData.inventory, 'inventory');
        if (typeof targetInventory === 'undefined') {
            delete offers[data.uid];
            Athena.player.emit.notification(target, `Trade could not be completed.`);
            return;
        }

        delete offers[data.uid];
        await Athena.document.character.set(player, 'inventory', playerInventory);
        await Athena.document.character.set(target, 'inventory', targetInventory);
    },
    giveDecline(target: alt.Player, data: { uid: string }) {
        const offer = offers[data.uid];
        if (typeof offer === 'undefined') {
            Athena.player.emit.notification(target, `Item offer was not found.`);
            return;
        }

        const player = Athena.systems.identifier.getPlayer(offer.from);
        if (typeof player === 'undefined') {
            delete offers[data.uid];
            return;
        }

        Athena.player.emit.notification(player, `Item offer was declined.`);
    },
    /**
     * Handles the item pickup event when an item is registered for pickup.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {string} _id
     */
    async pickupItem(player: alt.Player, _id: string) {
        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        if (!Athena.systems.inventory.drops.isItemAvailable(_id)) {
            Athena.player.emit.notification(player, `[0x01] Item is unavailable. Try again in a moment.`);
            return;
        }

        Athena.systems.inventory.drops.markForTaken(_id, true);

        const originalItem = Athena.systems.inventory.drops.get(_id);
        if (typeof originalItem === 'undefined') {
            Athena.player.emit.notification(player, `[0x02] Item is unavailable. Try again in a moment.`);
            Athena.systems.inventory.drops.markForTaken(_id, false);
            return;
        }

        const item = deepCloneObject<ItemDrop>(originalItem);
        delete item._id;
        delete item.pos;
        delete item.expiration;
        delete item.pos;
        delete item.name;

        const newInventory = Athena.systems.inventory.manager.add(item, data.inventory, 'inventory');
        if (typeof newInventory === 'undefined') {
            Athena.player.emit.notification(player, `No room in inventory, or too heavy.`);
            Athena.systems.inventory.drops.markForTaken(_id, false);
            return;
        }

        await Athena.document.character.set(player, 'inventory', newInventory);
        await Athena.systems.inventory.drops.sub(_id);
        Athena.player.emit.sound2D(
            player,
            `@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_pickup.ogg`,
            0.2,
        );
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
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.GIVE, Internal.give);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.OPEN, Internal.callbacks.open);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.CLOSE, Internal.callbacks.close);
        alt.onClient(EVENTS.ACCEPT, Internal.giveAccept);
        alt.onClient(EVENTS.DECLINE, Internal.giveDecline);
        Athena.player.events.on('pickup-item', Internal.pickupItem);
    },
    callbacks: {
        add: addCallback,
    },
    controls: {
        /**
         * Force open an inventory.
         *
         * @param {alt.Player} player An alt:V Player Entity
         */
        open(player: alt.Player) {
            player.emit(INVENTORY_EVENTS.TO_CLIENT.OPEN);
        },
        /**
         * Force close the inventory if it is open.
         *
         * @param {alt.Player} player An alt:V Player Entity
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
         * @param {alt.Player} player An alt:V Player Entity
         * @param {string} uid A unique string
         * @param {Array<StoredItem>} items
         */
        async open(
            player: alt.Player,
            uid: string,
            items: Array<StoredItem>,
            storageSize: number,
            forceOpenInventory = false,
            maxWeight: number = Number.MAX_SAFE_INTEGER,
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
            openStoragesWeight[player.id] = maxWeight;
            const fullStorageList = Athena.systems.inventory.manager.convertFromStored(openStorages[player.id]);
            Athena.webview.emit(player, INVENTORY_EVENTS.TO_WEBVIEW.SET_CUSTOM, fullStorageList, storageSize);
        },
        /**
         * Updates a storage session with new data.
         *
         * @param {alt.Player} player An alt:V Player Entity
         * @param {Array<StoredItem>} items
         */
        resync(player: alt.Player) {
            if (!openStorages[player.id]) {
                return;
            }

            const fullStorageList = Athena.systems.inventory.manager.convertFromStored(openStorages[player.id]);
            Athena.webview.emit(player, INVENTORY_EVENTS.TO_WEBVIEW.SET_CUSTOM, fullStorageList);
        },
        /**
         * Returns true if a player is using the matching session uid.
         *
         * @param {alt.Player} player An alt:V Player Entity
         * @param {string} uid A unique string
         * @return {void}
         */
        isUsingSession(player: alt.Player, uid: string) {
            return openStorageSessions[player.id] === uid;
        },
        /**
         * Returns true if the session with a specific uid is in use.
         *
         * @param {string} uid A unique string
         * @return {void}
         */
        isSessionInUse(uid: string) {
            return Object.values(openStorageSessions).includes(uid);
        },
    },
};
