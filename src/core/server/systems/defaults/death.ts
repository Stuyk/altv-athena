import * as alt from 'alt-server';
import { eventsConst } from '@AthenaServer/api/consts/constEvents';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { Athena } from '@AthenaServer/api/athena';

let enabled = true;

/**
 * Respawns the player, and resets their death data.
 *
 * @param {alt.Player} victim
 * @return {*}
 */
function respawn(victim: alt.Player) {
    if (!enabled) {
        return;
    }

    if (!victim.data.isDead) {
        return;
    }

    Athena.document.character.set(victim, 'isDead', false);
    victim.spawn(victim.pos.x, victim.pos.y, victim.pos.z, 0);
}

/**
 * Respawns the player after 5 seconds in their same position.
 *
 * @param {alt.Player} victim
 * @return {*}
 */
function handleDefaultDeath(victim: alt.Player) {
    if (!enabled) {
        return;
    }

    if (!victim || !victim.data || !victim.hasFullySpawned) {
        return;
    }

    Athena.document.character.set(victim, 'isDead', true);

    alt.setTimeout(() => {
        if (!victim || !victim.valid) {
            return;
        }

        respawn(victim);
    }, 5000);
}

export const DefaultDeathSystem = {
    disable: () => {
        enabled = false;
        alt.off('playerDeath', handleDefaultDeath);
        alt.log(`Default Death System Turned Off`);
    },
};

eventsConst.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, respawn);
alt.on('playerDeath', handleDefaultDeath);
