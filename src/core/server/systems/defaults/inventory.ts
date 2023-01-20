import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { PLAYER_LOCAL_META } from '@AthenaShared/enums/playerSynced';
import { StoredItem } from '@AthenaShared/interfaces/item';
import { Athena } from '@AthenaServer/api/athena';
import { PluginSystem } from '../plugins';

let enabled = true;

const Internal = {
    /**
     * This synchronizes the inventory when the player selects their character.
     * Can be fetched on client-side with getLocalMeta
     *
     * @param {alt.Player} player
     */
    sync(player: alt.Player) {
        if (!enabled) {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        const inventory: Array<StoredItem> = typeof data.inventory !== 'undefined' ? data.inventory : [];
        const toolbar: Array<StoredItem> = typeof data.toolbar !== 'undefined' ? data.toolbar : [];

        const fullInventory = Athena.systems.itemManager.inventory.convertFromStored(inventory);
        const fullToolbar = Athena.systems.itemManager.inventory.convertFromStored(toolbar);

        player.setLocalMeta(PLAYER_LOCAL_META.INVENTORY, fullInventory);
        player.setLocalMeta(PLAYER_LOCAL_META.TOOLBAR, fullToolbar);
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

        Internal.sync(player);
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

        Internal.sync(player);
    },
    /**
     * Initializes the initial events for handling document changes.
     */
    init() {
        if (!enabled) {
            return;
        }

        Athena.events.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, Internal.sync);
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
