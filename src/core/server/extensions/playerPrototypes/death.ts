import * as alt from 'alt-server';
import { distance2d } from '../../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../../athena/main';

export function handleDeathRespawnPrototype(position: alt.Vector3 = null): void {
    this.nextDeathSpawn = null;
    this.data.isDead = false;
    this.emitMeta('isDead', false);
    this.saveField('isDead', false);

    if (DEFAULT_CONFIG.RESPAWN_LOSE_WEAPONS) {
        this.removeAllWeapons();
    }

    let nearestHopsital = position;
    if (!position) {
        const hospitals = [...DEFAULT_CONFIG.VALID_HOSPITALS];
        let index = 0;
        let lastDistance = distance2d(this.pos, hospitals[0]);

        for (let i = 1; i < hospitals.length; i++) {
            const distanceCalc = distance2d(this.pos, hospitals[i]);
            if (distanceCalc > lastDistance) {
                continue;
            }

            lastDistance = distanceCalc;
            index = i;
        }

        nearestHopsital = hospitals[index] as alt.Vector3;
    }

    this.safeSetPosition(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    this.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    this.safeAddHealth(DEFAULT_CONFIG.RESPAWN_HEALTH, true);
    this.safeAddArmour(DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
}
