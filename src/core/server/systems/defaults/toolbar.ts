import * as alt from 'alt-server';

import { PluginSystem } from '../plugins';
import { Athena } from '@AthenaServer/api/athena';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

const SYSTEM_NAME = 'Toolbar';

let enabled = true;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

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
};

export const DefaultToolbarSystem = {
    disable: () => {
        enabled = false;
        alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);
