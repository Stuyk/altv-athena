import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import './interaction';
import './vehicle';
import '../views/inventory';

const timeBetweenPings = 4950;

alt.onClient(SYSTEM_EVENTS.PLAYER_TICK, handlePing);

/**
 * This is a tick event that is sent up from the player.
 * This tick event is then used to process specific player events.
 * This varies from player revival, coordinate processing, etc.
 * Helps push the load onto the server, rather than the player.
 * @param {alt.Player} player
 * @return {*}
 */
function handlePing(player: alt.Player): void {
    if (player.nextPingTime && Date.now() < player.nextPingTime) {
        return;
    }

    player.nextPingTime = Date.now() + timeBetweenPings;

    player.save().onTick();
    player.sync().syncedMeta();
    player.sync().time();
    player.sync().weather();

    if (player.nextDeathSpawn && Date.now() > player.nextDeathSpawn - 1000) {
        player.set().respawned(null); // Uses null to find a hospital.
    }
}
