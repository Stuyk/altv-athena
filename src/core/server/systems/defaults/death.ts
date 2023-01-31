import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { PluginSystem } from '../plugins';

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
     * Respawns the player, and resets their death data.
     *
     * @param {alt.Player} victim
     * @return {*}
     */
    respawn(victim: alt.Player) {
        if (!enabled) {
            return;
        }

        const victimData = Athena.document.character.get(victim);
        if (!victimData.isDead) {
            return;
        }

        Athena.document.character.set(victim, 'isDead', false);
        victim.spawn(victim.pos.x, victim.pos.y, victim.pos.z, 0);
        Athena.events.player.trigger('respawned', victim);
    },

    /**
     * Respawns the player after 5 seconds in their same position.
     *
     * @param {alt.Player} victim
     * @return {*}
     */
    handleDefaultDeath(victim: alt.Player) {
        if (!enabled) {
            return;
        }

        if (!victim || !victim.valid) {
            return;
        }

        const victimData = Athena.document.character.get(victim);
        if (!victimData) {
            return;
        }

        Athena.document.character.set(victim, 'isDead', true);
        Athena.events.player.trigger('player-died', victim);

        alt.setTimeout(() => {
            if (!victim || !victim.valid) {
                return;
            }

            Internal.respawn(victim);
        }, 5000);
    },
    init() {
        if (!enabled) {
            return;
        }

        Athena.events.player.on('selected-character', Internal.respawn);
        alt.on('playerDeath', Internal.handleDefaultDeath);
        alt.log(`~lc~Default System: ~g~Death`);
    },
};

export const DefaultDeathSystem = {
    disable: () => {
        enabled = false;
        alt.off('playerDeath', Internal.handleDefaultDeath);
        alt.log(`~y~Default Death System Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);
