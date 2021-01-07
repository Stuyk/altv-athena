import * as alt from 'alt-client';
import * as native from 'natives';
import { sleep } from './sleep';

/**
 * Zoom all the way out. Then zoom all the way in from the sky.
 * @export
 * @param {number} duration
 * @return {*}  {Promise<boolean>}
 */
export async function switchInPlayer(duration: number): Promise<boolean> {
    if (!native.isPlayerSwitchInProgress()) {
        native.switchOutPlayer(alt.Player.local.scriptID, 0, 2);
    }

    await sleep(duration);

    native.switchInPlayer(alt.Player.local.scriptID);
    return true;
}
