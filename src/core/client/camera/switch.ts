import * as alt from 'alt-client';
import * as native from 'natives';

import { SWITCHOUT_TYPES } from '@AthenaShared/enums/switchOutTypes.js';

/**
 * Zoom all the way out. Then zoom all the way in from the sky.
 *
 *
 * @param {number} timeInMs
 * @param {SWITCHOUT_TYPES} switchType
 * @return {Promise<boolean>}
 */
export async function switchToMultiSecondpart(
    timeInMs: number,
    switchType: SWITCHOUT_TYPES = SWITCHOUT_TYPES.THREE_STEPS,
): Promise<boolean> {
    if (Overrides.switchToMultiSecondpart) {
        return Overrides.switchToMultiSecondpart(timeInMs, switchType);
    }

    if (!native.isPlayerSwitchInProgress()) {
        native.switchToMultiFirstpart(alt.Player.local.scriptID, 0, switchType);
    }

    await alt.Utils.wait(timeInMs);

    native.switchToMultiSecondpart(alt.Player.local.scriptID);
    return true;
}

interface SwitchCameraFuncs {
    switchToMultiSecondpart: typeof switchToMultiSecondpart;
}

const Overrides: Partial<SwitchCameraFuncs> = {};

export function override(functionName: 'switchToMultiSecondpart', callback: typeof switchToMultiSecondpart);
export function override(functionName: keyof SwitchCameraFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
