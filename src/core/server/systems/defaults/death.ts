import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { Athena } from '@AthenaServer/api/athena';
import { PluginSystem } from '../plugins';

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

        Athena.events.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, Internal.respawn);
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
