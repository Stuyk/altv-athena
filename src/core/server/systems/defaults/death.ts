import * as alt from 'alt-server';

let enabled = true;

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

    victim.spawn(victim.pos.x, victim.pos.y, victim.pos.z, 5000);
}

export const DefaultDeathSystem = {
    disable: () => {
        enabled = false;
        alt.off('playerDeath', handleDefaultDeath);
        alt.log(`Default Death System Turned Off`);
    },
};

alt.on('playerDeath', handleDefaultDeath);
