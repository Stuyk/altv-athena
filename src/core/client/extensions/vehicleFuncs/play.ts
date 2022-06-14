import * as alt from 'alt-client';
import * as native from 'natives';
import { sleep } from '../../utility/sleep';

/**
 * Play the carn horn multiple times.
 * @param {number} numberOfTimes
 * @param {number} lengthOfHorn
 * @return {*}  {Promise<void>}
 * @memberof Vehicle
 */
async function carHorn(v: alt.Vehicle, numberOfTimes: number, lengthOfHorn: number): Promise<void> {
    // Don't flash if the player is in the vehicle.
    if (alt.Player.local.vehicle === v) {
        return;
    }

    for (let i = 0; i < numberOfTimes; i++) {
        native.startVehicleHorn(v.scriptID, lengthOfHorn, 0, false);
        await sleep(lengthOfHorn + 25);
    }
}

/**
 * Flash vehicle lights multiple times.
 * @param {number} numberOfTimes
 * @param {number} delayBetween
 * @return {*}  {Promise<void>}
 * @memberof Vehicle
 */
async function lights(v: alt.Vehicle, numberOfTimes: number, delay: number): Promise<void> {
    let count = 0;

    // Don't flash if the player is in the vehicle.
    if (alt.Player.local.vehicle === v) {
        return;
    }

    const interval = alt.setInterval(() => {
        native.setVehicleLights(v.scriptID, 0); // Lights Off
        if (count > numberOfTimes) {
            alt.clearInterval(interval);
            return;
        }

        native.setVehicleLights(v.scriptID, 2); // Normal Lights
        count += 1;
    }, delay);
}

export default {
    carHorn,
    lights,
};
