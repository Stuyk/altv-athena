import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

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

        Athena.player.events.on('respawned', Internal.unequipAllWeapons);
        Athena.player.events.on('selected-character', Internal.processPlayer);
        alt.onClient(SYSTEM_EVENTS.PLAYER_TOOLBAR_INVOKE, Internal.invoke);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
    /**
     * Enable default toolbar functionality with an event call down to the system.
     *
     * @param {alt.Player} player An alt:V Player Entity
     */
    processPlayer(player: alt.Player) {
        player.emit(SYSTEM_EVENTS.PLAYER_TOOLBAR_ENABLE);
    },
    /**
     * Invokes a use item effect.
     * Should always be called when using an item.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {number} slot
     */
    invoke(player: alt.Player, slot: number, type: 'inventory' | 'toolbar' = 'toolbar') {
        Athena.systems.inventory.manager.useItem(player, slot, type);
    },
    /**
     * Unequip all weapons on respawn.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @return {void}
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
        Athena.systems.inventory.weapons.update(player);
    },
};

/**
 * Disable the toolbar hotkeys / processing on server-side.
 *
 * #### Example
 * ```ts
 * Athena.systems.default.toolbar.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
