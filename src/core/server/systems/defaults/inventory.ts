import * as alt from 'alt-server';

import { StoredItem } from '@AthenaShared/interfaces/item';
import { Athena } from '@AthenaServer/api/athena';
import { PluginSystem } from '../plugins';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

let enabled = true;

const Internal = {
    /**
     * This synchronizes the inventory when the player selects their character.
     * Can be fetched on client-side with getLocalMeta
     *
     * @param {alt.Player} player
     */
    sync(player: alt.Player, isCharacterSelect = true) {
        if (!enabled) {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        if (isCharacterSelect) {
            const config = Athena.systems.itemManager.config.get();
            Athena.config.player.set(player, 'inventory-size', config.inventory.size);
            Athena.config.player.set(player, 'inventory-weight-enabled', config.weight.enabled);
            Athena.config.player.set(player, 'inventory-max-weight', config.weight.player);
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        const inventory: Array<StoredItem> = typeof data.inventory !== 'undefined' ? data.inventory : [];
        const toolbar: Array<StoredItem> = typeof data.toolbar !== 'undefined' ? data.toolbar : [];

        const fullInventory = Athena.systems.itemManager.inventory.convertFromStored(inventory);
        const fullToolbar = Athena.systems.itemManager.inventory.convertFromStored(toolbar);

        let totalWeight = 0;
        totalWeight += Athena.systems.itemManager.inventory.getWeight(inventory);
        totalWeight += Athena.systems.itemManager.inventory.getWeight(toolbar);

        player.emit(SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_SYNC, fullInventory, fullToolbar, totalWeight);
    },
    /**
     * Automatically synchronizes the inventory for a player when data is changed.
     *
     * @param {alt.Player} player
     * @param {Array<StoredItem>} newValue
     */
    syncInventory(player: alt.Player) {
        if (!enabled) {
            return;
        }

        Internal.sync(player, false);
    },
    /**
     * Automatically synchronizes the toolbar for a player when data is changed.
     *
     * @param {alt.Player} player
     * @param {Array<StoredItem>} newValue
     */
    syncToolbar(player: alt.Player) {
        if (!enabled) {
            return;
        }

        Internal.sync(player, false);
    },
    /**
     * Initializes the initial events for handling document changes.
     */
    init() {
        if (!enabled) {
            return;
        }

        Athena.events.player.on('selected-character', Internal.sync);
        Athena.document.character.onChange('inventory', Internal.syncInventory);
        Athena.document.character.onChange('toolbar', Internal.syncToolbar);
        alt.log(`~lc~Default System: ~g~Inventory`);
    },
};

export const DefaultInventorySystem = {
    disable: () => {
        enabled = false;
        alt.log(`~y~Default Inventory Sync Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);
