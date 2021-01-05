import * as alt from 'alt-server';
import { Events_Misc } from '../../shared/enums/events';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';

const timeBetweenPings = 4750;

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
    if (!player.nextPingTime) {
        player.nextPingTime = Date.now() + timeBetweenPings;
        return;
    }

    if (Date.now() < player.nextPingTime) {
        return;
    }

    player.nextPingTime = Date.now() + timeBetweenPings;
    player.setSyncedMeta('Ping', player.ping);

    if (player.nextDeathSpawn && Date.now() > player.nextDeathSpawn) {
        player.data.isDead = false;
        player.nextDeathSpawn = null;
        player.emitMeta('isDead', false);
        player.saveField('isDead', false);
        player.removeAllWeapons();

        const hospitals = [...DEFAULT_CONFIG.VALID_HOSPITALS];
        let index = 0;
        let lastDistance = distance2d(player.pos, hospitals[0]);

        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(player.pos, hospitals[i]);
            if (distanceCalc > lastDistance) {
                continue;
            }

            lastDistance = distanceCalc;
            index = i;
        }

        const nearestHopsital = hospitals[index];
        player.safeSetPosition(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
        player.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    }
}
