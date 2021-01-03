import * as alt from 'alt-server';
import { Events_Misc } from '../../shared/enums/events';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';

const timeBetweenPings = 4750;

alt.onClient(Events_Misc.Ping, handlePing);

function handlePing(player: alt.Player) {
    if (!player.nextPingTime) {
        player.nextPingTime = Date.now() + timeBetweenPings;
        return;
    }

    if (Date.now() < player.nextPingTime) {
        return;
    }

    player.nextPingTime = Date.now() + timeBetweenPings;

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
