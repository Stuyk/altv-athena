import * as alt from 'alt-client';
import * as native from 'natives';

import { SWITCHOUT_TYPES } from '@AthenaShared/enums/switchOutTypes';

/**
 * Zoom all the way out. Then zoom all the way in from the sky.
 *
 * @export
 * @param {number} timeInMs
 * @param {SWITCHOUT_TYPES} switchType
 * @return {Promise<boolean>}
 */
export async function switchToMultiSecondpart(
    timeInMs: number,
    switchType: SWITCHOUT_TYPES = SWITCHOUT_TYPES.THREE_STEPS,
): Promise<boolean> {
    if (!native.isPlayerSwitchInProgress()) {
        native.switchToMultiFirstpart(alt.Player.local.scriptID, 0, switchType);
    }

    await alt.Utils.wait(timeInMs);

    native.switchToMultiSecondpart(alt.Player.local.scriptID);
    return true;
}
