import { distance2d } from '../../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../../athena/main';

export function handleDeathRespawnPrototype(): void {
    this.nextDeathSpawn = null;
    this.data.isDead = false;
    this.emitMeta('isDead', false);
    this.saveField('isDead', false);

    if (DEFAULT_CONFIG.RESPAWN_LOSE_WEAPONS) {
        this.removeAllWeapons();
    }

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

    const nearestHopsital = hospitals[index];
    this.safeSetPosition(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
    this.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);
    this.safeAddHealth(DEFAULT_CONFIG.RESPAWN_HEALTH, true);
    this.safeAddArmour(DEFAULT_CONFIG.RESPAWN_ARMOUR, true);
}
