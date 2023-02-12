import * as alt from 'alt-server';

import { PluginSystem } from '../plugins';
import { Athena } from '@AthenaServer/api/athena';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Toolbar';

let enabled = true;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

        Athena.events.player.on('respawned', Internal.unequipAllWeapons);
        Athena.events.player.on('selected-character', Internal.processPlayer);
        alt.onClient(SYSTEM_EVENTS.PLAYER_TOOLBAR_INVOKE, Internal.invoke);
    },
    /**
     * Enable default toolbar functionality with an event call down to the system.
     *
     * @param {alt.Player} player
     */
    processPlayer(player: alt.Player) {
        player.emit(SYSTEM_EVENTS.PLAYER_TOOLBAR_ENABLE);
    },
    /**
     * Invokes a use item effect.
     * Should always be called when using an item.
     *
     * @param {alt.Player} player
     * @param {number} slot
     */
    invoke(player: alt.Player, slot: number, type: 'inventory' | 'toolbar' = 'toolbar') {
        Athena.systems.itemManager.utility.useItem(player, slot, type);
    },
    /**
     * Unequip all weapons on respawn.
     *
     * @param {alt.Player} player
     * @return {*}
     */
    unequipAllWeapons(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined' || typeof data.toolbar === 'undefined') {
            return;
        }

        for (let i = 0; i < data.toolbar.length; i++) {
            data.toolbar[i].isEquipped = false;
        }

        Athena.document.character.set(player, 'toolbar', data.toolbar);
        Athena.systems.itemWeapon.update(player);
    },
};

export const DefaultToolbarSystem = {
    disable: () => {
        enabled = false;
        alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);