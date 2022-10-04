import * as alt from 'alt-client';
import * as native from 'natives';
import { SWITCHOUT_TYPES } from '../../shared/enums/switchOutTypes';
import { sleep } from './sleep';

/**
 * Zoom all the way out. Then zoom all the way in from the sky.
 * @export
 * @param {number} duration
 * @param {SWITCHOUT_TYPES} switchType
 * @return {*}  {Promise<boolean>}
 */
export async function switchInPlayer(duration: number, switchType: SWITCHOUT_TYPES = SWITCHOUT_TYPES.THREE_STEPS): Promise<boolean> {
    if (!native.isPlayerSwitchInProgress()) {
        native.switchOutPlayer(alt.Player.local.scriptID, 0, switchType);
    }

    await sleep(duration);

    native.switchInPlayer(alt.Player.local.scriptID);
    return true;
}
