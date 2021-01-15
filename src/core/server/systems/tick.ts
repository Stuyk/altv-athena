import * as alt from 'alt-server';
import { Events_Misc } from '../../shared/enums/events';
import { updatePlayerTime, updatePlayerWeather } from './world';
import './interaction';
import './vehicle';

const timeBetweenPings = 4950;

alt.onClient(Events_Misc.Ping, handlePing);

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
    player.sync().syncedMeta();
    player.save().onTick();

    updatePlayerTime(player);
    updatePlayerWeather(player);

    if (player.nextDeathSpawn && Date.now() > player.nextDeathSpawn) {
        player.set().respawned(null); // Uses null to find a hospital.
    }
}
