import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { StoredItem } from '@AthenaShared/interfaces/item';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

let enabled = true;

const Internal = {
    /**
     * This synchronizes the inventory when the player selects their character.
     * Can be fetched on client-side with getLocalMeta
     *
     * @param {alt.Player} player An alt:V Player Entity
     */
    sync(player: alt.Player, isCharacterSelect = true) {
        if (!enabled) {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        if (isCharacterSelect) {
            const config = Athena.systems.inventory.config.get();
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

        const fullInventory = Athena.systems.inventory.manager.convertFromStored(inventory);
        const fullToolbar = Athena.systems.inventory.manager.convertFromStored(toolbar);

        let totalWeight = 0;
        totalWeight += Athena.systems.inventory.weight.getDataWeight(inventory);
        totalWeight += Athena.systems.inventory.weight.getDataWeight(toolbar);

        Athena.systems.inventory.clothing.update(player);

        player.emit(SYSTEM_EVENTS.PLAYER_EMIT_INVENTORY_SYNC, fullInventory, fullToolbar, totalWeight);
    },
    /**
     * Automatically synchronizes the inventory for a player when data is changed.
     *
     * @param {alt.Player} player An alt:V Player Entity
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
     * @param {alt.Player} player An alt:V Player Entity
     * @param {Array<StoredItem>} newValue
     */
    syncToolbar(player: alt.Player) {
        if (!enabled) {
            return;
        }

        Internal.sync(player, false);
        Athena.systems.inventory.weapons.update(player);
    },
    /**
     * Initializes the initial events for handling document changes.
     */
    init() {
        if (!enabled) {
            return;
        }

        Athena.player.events.on('selected-character', Internal.sync);
        Athena.document.character.onChange('inventory', Internal.syncInventory);
        Athena.document.character.onChange('toolbar', Internal.syncToolbar);
        alt.log(`~lc~Default System: ~g~Inventory`);
    },
};

/**
 * Disables inventory synchronization when the inventory or toolbar is changed.
 *
 *
 * #### Example
 * ```ts
 * Athena.systems.default.ammo.disable();
 * ```
 *
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default Inventory Sync Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
