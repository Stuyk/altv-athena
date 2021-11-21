import * as alt from 'alt-server';
import { IStorage } from '../../shared/interfaces/IStorage';
import { playerFuncs } from '../extensions/Player';
import { StorageSystem } from '../systems/storage';
import { View_Events_Storage } from '../../shared/enums/Views';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { Item } from '../../shared/interfaces/Item';
import { isFlagEnabled } from '../../shared/utility/flags';
import { ITEM_TYPE } from '../../shared/enums/ItemTypes';
import { IResponse } from '../../shared/interfaces/IResponse';
import { STORAGE_RULES } from '../../shared/enums/StorageRules';
import SystemRules from '../systems/rules';

/**
 * Bind a player id to a storage container.
 * Removes binding on player disconnect.
 * @type { [id: string]: string }
 * */
let storageBinding: { [id: string]: string } = {};
let storageCache: { [id: number]: IStorage } = {};
let rules: { [key: string]: Array<(player: alt.Player, storage: IStorage) => IResponse> } = {
    [STORAGE_RULES.OPEN]: [],
};

export class StorageView {
    /**
     * Open storage for a specific container.
     * @static
     * @param {alt.Player} player
     * @param {string} id
     * @return {*}  {Promise<void>}
     * @memberof StorageView
     */
    static async open(player: alt.Player, storage_id: string, name: string): Promise<void> {
        const storage = await StorageSystem.get(storage_id);
        if (!storage) {
            playerFuncs.emit.notification(player, `~r~No Storage Available`);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            StorageSystem.setRestricted(storage_id, false);
            return;
        }

        // Check if storage is Restricted
        if (StorageSystem.isRestricted(storage_id)) {
            playerFuncs.emit.notification(player, `~r~Storage in Use`);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        // Restrict Storage Access to Single Player
        StorageSystem.setRestricted(storage_id, true);

        // Check any custom rules that may apply.
        if (!SystemRules.check(STORAGE_RULES.OPEN, rules, player, storage)) {
            return;
        }

        // Push Storage Info Client-Side
        storageCache[player.id] = storage;
        StorageView.setStorageBinding(player.id, storage_id);
        alt.emitClient(player, View_Events_Storage.Open, storage_id, name, storage.items, player.data.inventory);
    }

    /**
     * Add a custom rule to storage events.
     * @static
     * @param {STORAGE_RULES} ruleType
     * @param {(player: alt.Player, storage: IStorage) => IResponse} callback
     * @return {*}
     * @memberof StorageView
     */
    static addCustomRule(ruleType: STORAGE_RULES, callback: (player: alt.Player, storage: IStorage) => IResponse) {
        if (!rules[ruleType]) {
            alt.logError(`${ruleType} does not exist for StorageView Rules`);
            return;
        }

        rules[ruleType].push(callback);
    }

    /**
     * Binds the storage instance to a player id.
     * @static
     * @param {number} id
     * @param {string} [storageID=null]
     * @return {*}
     * @memberof StorageView
     */
    static setStorageBinding(playerID: number, storageID: string) {
        storageBinding[playerID] = storageID;
    }

    /**
     * Removes the storage binding.
     * @static
     * @param {number} id
     * @return {*}
     * @memberof StorageView
     */
    static removeStorageBinding(playerID: number) {
        const storedStorageID = storageBinding[playerID];

        delete storageBinding[playerID];
        delete storageCache[playerID];

        if (!storedStorageID) {
            return;
        }

        StorageSystem.setRestricted(storedStorageID, false);
    }

    /**
     * Is the player id currently using a storage box?
     * @static
     * @param {alt.Player} player
     * @param {string} id
     * @return {*}  {boolean}
     * @memberof StorageView
     */
    static isMatchingStorageBinding(player: alt.Player, id: string): boolean {
        if (!storageBinding[player.id]) {
            return false;
        }

        if (storageBinding[player.id] !== id) {
            return false;
        }

        return true;
    }

    /**
     * Move item from the storage box to the player.
     * @static
     * @param {alt.Player} player
     * @memberof StorageView
     */
    static async moveFromStorage(player: alt.Player, id: string, index: number, amount: number) {
        if (!id) {
            return;
        }

        if (!player || !player.valid) {
            StorageView.removeStorageBinding(player.id);
            StorageSystem.setRestricted(id, false);
            return;
        }

        if (!StorageView.isMatchingStorageBinding(player, id)) {
            StorageView.removeStorageBinding(player.id);
            StorageSystem.setRestricted(id, false);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            alt.emitClient(player, View_Events_Storage.Close);
            return;
        }

        // Check if the storage cache is set.
        if (!storageCache[player.id]) {
            StorageView.removeStorageBinding(player.id);
            StorageSystem.setRestricted(id, false);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            alt.emitClient(player, View_Events_Storage.Close);
            return;
        }

        // Check if the item exists.
        if (!storageCache[player.id].items[index]) {
            alt.emitClient(player, View_Events_Storage.Refresh, player.data.inventory, storageCache[player.id].items);
            return;
        }

        const openSlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            playerFuncs.emit.notification(player, `Inventory is Full`);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const itemClone = deepCloneObject<Item>(storageCache[player.id].items[index]);
        if (amount === null) {
            amount = itemClone.quantity;
        }

        if (amount > itemClone.quantity) {
            amount = itemClone.quantity;
        }

        if (amount === itemClone.quantity) {
            const removedItem = storageCache[player.id].items.splice(index, 1)[0];
            if (!removedItem) {
                playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
        } else {
            itemClone.quantity -= amount;
        }

        playerFuncs.inventory.inventoryAdd(player, itemClone, openSlot.slot);
        playerFuncs.save.field(player, 'inventory', player.data.inventory);
        playerFuncs.sync.inventory(player);

        await StorageSystem.update(storageCache[player.id]._id.toString(), { items: storageCache[player.id].items });
        alt.emitClient(player, View_Events_Storage.Refresh, player.data.inventory, storageCache[player.id].items);
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
    }

    /**
     * Move an item from the player to the storage box.
     * @static
     * @param {alt.Player} player
     * @param {number} tab
     * @param {number} index
     * @memberof StorageView
     */
    static async moveFromPlayer(player: alt.Player, id: string, index: number, amount: number) {
        if (!id) {
            return;
        }

        if (!player || !player.valid) {
            StorageView.removeStorageBinding(player.id);
            StorageSystem.setRestricted(id, false);
            return;
        }

        if (!StorageView.isMatchingStorageBinding(player, id)) {
            StorageView.removeStorageBinding(player.id);
            StorageSystem.setRestricted(id, false);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            alt.emitClient(player, View_Events_Storage.Close);
            return;
        }

        if (!storageCache[player.id]) {
            StorageView.removeStorageBinding(player.id);
            StorageSystem.setRestricted(id, false);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            alt.emitClient(player, View_Events_Storage.Close);
            return;
        }

        if (!player.data.inventory[index]) {
            alt.emitClient(player, View_Events_Storage.Refresh, player.data.inventory, storageCache[player.id].items);
            return;
        }

        const existingIndex = storageCache[player.id].items.findIndex((x) => {
            if (x.name !== player.data.inventory[index].name) {
                return false;
            }

            if (x.rarity !== player.data.inventory[index].rarity) {
                return false;
            }

            if (x.maxStack && x.quantity === x.maxStack) {
                return false;
            }

            return true;
        });

        if (existingIndex <= -1 && storageCache[player.id].items.length + 1 > storageCache[player.id].maxSize) {
            alt.emitClient(player, View_Events_Storage.Refresh, player.data.inventory, storageCache[player.id].items);
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        // Simply clone and remove the item.
        const itemClone = deepCloneObject<Item>(player.data.inventory[index]);
        if (amount === null) {
            amount = itemClone.quantity;
        }

        if (amount > itemClone.quantity) {
            amount = itemClone.quantity;
        }

        // Literally the exact amount to remove.
        // Remove the item from the inventory entirely.
        if (amount === itemClone.quantity) {
            if (!playerFuncs.inventory.inventoryRemove(player, player.data.inventory[index].slot)) {
                alt.emitClient(
                    player,
                    View_Events_Storage.Refresh,
                    player.data.inventory,
                    storageCache[player.id].items,
                );
                return;
            }
        } else {
            // Remove the amount from the inventory stack.
            player.data.inventory[index].quantity -= amount;
        }

        // Item exists in storage and can be stacked.
        const canStack = isFlagEnabled(itemClone.behavior, ITEM_TYPE.CAN_STACK);
        if (existingIndex >= 0 && canStack) {
            const currentStorageItem = storageCache[player.id].items[existingIndex];

            // If the max stack is exceeded in storage if quantity is added to it
            if (itemClone.maxStack && currentStorageItem.quantity + amount > itemClone.maxStack) {
                // Add missing amount to storage. However, create another item to push into storage.
                // We add to the existing.
                // We remove from the clone and then push the clone to fill in the rest.
                const missingAmount = itemClone.maxStack - currentStorageItem.quantity;
                storageCache[player.id].items[existingIndex].quantity += missingAmount;
                amount -= missingAmount;

                itemClone.quantity = amount;
                storageCache[player.id].items.push(itemClone);
            } else {
                // Stack and ignore max stack property.
                storageCache[player.id].items[existingIndex].quantity += amount;
            }
        } else {
            itemClone.quantity = amount;
            storageCache[player.id].items.push(itemClone);
        }

        playerFuncs.save.field(player, 'inventory', player.data.inventory);
        playerFuncs.sync.inventory(player);

        await StorageSystem.update(storageCache[player.id]._id.toString(), { items: storageCache[player.id].items });
        playerFuncs.emit.sound2D(player, 'item_shuffle_1', Math.random() * 0.45 + 0.1);
        alt.emitClient(player, View_Events_Storage.Refresh, player.data.inventory, storageCache[player.id].items);
    }

    /**
     * Called when a player closes a storage box.
     * @static
     * @param {alt.Player} player
     * @memberof StorageView
     */
    static close(player: alt.Player) {
        StorageView.removeStorageBinding(player.id);
    }
}

alt.onClient(View_Events_Storage.MoveFromPlayer, StorageView.moveFromPlayer);
alt.onClient(View_Events_Storage.MoveFromStorage, StorageView.moveFromStorage);
alt.onClient(View_Events_Storage.Close, StorageView.close);
