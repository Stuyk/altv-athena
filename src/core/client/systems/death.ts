import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { drawText2D } from '../utility/text';

alt.on(SYSTEM_EVENTS.META_CHANGED, handleSingleMetaChange);

let interval: number;
let deathTime: number;

/**
 * Called when local player meta has changed for self.
 * @param {string} key
 * @param {*} newValue
 * @param {*} oldValue
 * @return {*}  {void}
 */
function handleSingleMetaChange(key: string, newValue: any, oldValue: any): void {
    if (key !== 'isDead') {
        return;
    }

    if (newValue) {
        if (!interval) {
            interval = alt.setInterval(handleDeathMovement, 0);
            deathTime = Date.now() + SHARED_CONFIG.RESPAWN_TIME;
        }
        return;
    }

    if (!interval) {
        return;
    }

    native.clearPedTasksImmediately(alt.Player.local.scriptID);
    alt.clearInterval(interval);
    interval = null;
}

/**
 * Draws text and sets into ragdoll mode.
 */
function handleDeathMovement() {
    if (!native.isPedRagdoll(alt.Player.local.scriptID)) {
        native.setPedToRagdoll(alt.Player.local.scriptID, -1, -1, 0, false, false, false);
    }

    const timeLeft = deathTime - Date.now();
    if (timeLeft > 0) {
        drawText2D(
            `${(timeLeft / 1000).toFixed(2)}s Until Respawn`,
            { x: 0.5, y: 0.2 },
            0.5,
            new alt.RGBA(255, 255, 255, 255)
        );
    } else {
        drawText2D(`/acceptdeath - To Trigger Respawn`, { x: 0.5, y: 0.2 }, 0.5, new alt.RGBA(255, 255, 255, 255));
    }
}
