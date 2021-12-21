import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SCENARIO, playScenario);

/**
 * Play an animation for the local player.
 * @export
 * @param {string} name The name of the scenario.
 * @param {number} duration The duration of the scenario.
 * @return {Promise<void>}  {Promise<void>}
 */
export async function playScenario(name: string, duration: number): Promise<void> {
    if (alt.Player.local.meta.isDead) {
        return;
    }

    if (native.isPedUsingScenario(alt.Player.local.scriptID, name)) {
        return;
    }

    native.taskStartScenarioInPlace(alt.Player.local.scriptID, name, -1, false);

    alt.setTimeout(() => {
        if (native.isPedUsingScenario(alt.Player.local.scriptID, name)) {
            native.clearPedTasksImmediately(alt.Player.local.scriptID);
        }
    }, duration);
}
