import * as alt from 'alt-server';

import { PluginSystem } from '../plugins';
import { Athena } from '@AthenaServer/api/athena';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

const SYSTEM_NAME = 'Toolbar';

let enabled = true;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

        Athena.events.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, Internal.processPlayer);
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
     *
     *
     * @param {alt.Player} player
     * @param {number} slot
     */
    invoke(player: alt.Player, slot: number) {
        if (!player || !player.valid) {
            return;
        }

        if (typeof slot !== 'number') {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data.toolbar === 'undefined') {
            return;
        }

        const storedItem = Athena.systems.itemManager.slot.getAt(slot, data.toolbar);
        if (typeof storedItem === 'undefined') {
            return;
        }

        console.log(storedItem);
    },
};

export const DefaultToolbarSystem = {
    disable: () => {
        enabled = false;
        alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);
