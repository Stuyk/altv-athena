import * as alt from 'alt-client';
import * as native from 'natives';
import { DEATH_CONFIG } from '../shared/config';
import { DEATH_EVENTS } from '../shared/events';
import { SCREEN_EFFECTS } from '../../../shared/enums/screenEffects';
import { drawText2D } from '../../../client/utility/text';
import { Timer } from '../../../client/utility/timers';
import { ScreenEffect } from '../../../client/utility/screenEffect';
import { KeyHeld } from '../../../client/events/keyHeld';
import { AthenaClient } from '../../../client/api/athena';
import { sleep } from '../../../client/utility/sleep';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { LOCALE_DEATH } from '../shared/locales';

let interval: number;
let timeInTheFuture: number;

native.animpostfxStopAll();

class InternalFunctions {
    static init() {
        alt.onServer(DEATH_EVENTS.UPDATE_DEATH_TIMER_MS, InternalFunctions.updateTimeLeft);
        alt.on('localMetaChange', InternalFunctions.handleMetaChange);
    }

    private static updateTimeLeft(ms: number) {
        timeInTheFuture = Date.now() + ms;
    }

    private static async handleRespawnKey() {
        // Can respawn now?
        if (timeInTheFuture - Date.now() <= 0) {
            // Unbind the respawn key
            KeyHeld.unregister(DEATH_CONFIG.RESPAWN_KEY, InternalFunctions.handleRespawnKey);

            if (!alt.Player.local.isDead) {
                return;
            }

            if (isAnyMenuOpen(false)) {
                return;
            }

            // Switch out player now
            AthenaClient.utility.switchInPlayer(2000);

            // Wait just a bit for the switch to start
            await sleep(1000);

            // Send the respawn pressed event
            alt.emitServer(DEATH_EVENTS.RESPAWN_PRESSED);
        }
    }

    private static handleMetaChange(key: string, newValue: any): void {
        if (key !== 'isDead') {
            return;
        }

        if (newValue) {
            if (!interval) {
                interval = Timer.createInterval(InternalFunctions.tick, 0, 'death.ts');
            }

            // Bind to respawn key
            KeyHeld.register(DEATH_CONFIG.RESPAWN_KEY, InternalFunctions.handleRespawnKey);

            // Start the effects
            native.playSoundFrontend(-1, 'Bed', 'WastedSounds', true);
            native.shakeGameplayCam('DEATH_FAIL_IN_EFFECT_SHAKE', 1);
            ScreenEffect.startEffect(SCREEN_EFFECTS.DEATH_FAIL_NEUTRAL_IN);
            return;
        }

        if (interval) {
            Timer.clearInterval(interval);
            interval = undefined;
        }

        // Clear the effects and ragdoll
        native.stopGameplayCamShaking(true);
        ScreenEffect.stopEffect(SCREEN_EFFECTS.DEATH_FAIL_NEUTRAL_IN);
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
    }

    private static tick() {
        if (!alt.Player.local.vehicle) {
            if (!native.isPedRagdoll(alt.Player.local.scriptID)) {
                native.setPedToRagdoll(alt.Player.local.scriptID, -1, -1, 0, true, true, false);
            }
        }

        native.hideHudAndRadarThisFrame();

        const timeLeft = timeInTheFuture - Date.now();
        if (timeLeft > 0) {
            drawText2D(
                `${(timeLeft / 1000).toFixed(0)}s ${LOCALE_DEATH.UNTIL_RESPAWN}`,
                { x: 0.5, y: 0.2 },
                0.75,
                new alt.RGBA(255, 255, 255, 255),
            );
        } else {
            drawText2D(LOCALE_DEATH.PRESS_KEY_TO_RESPAWN, { x: 0.5, y: 0.8 }, 1, new alt.RGBA(255, 255, 255, 255), 0);
        }
    }
}

InternalFunctions.init();
