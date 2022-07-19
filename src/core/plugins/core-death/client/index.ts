import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { drawText2D } from '../../../client/utility/text';
import { Timer } from '../../../client/utility/timers';
import { DEATH_EVENTS } from '../shared/events';

let interval: number;
let timeInTheFuture: number;

native.animpostfxStopAll();

class InternalFunctions {
    static init() {
        alt.onServer(DEATH_EVENTS.UPDATE_DEATH_TIMER_MS, InternalFunctions.updateTimeLeft);
        alt.on(SYSTEM_EVENTS.META_CHANGED, InternalFunctions.handleMetaChange);
    }

    private static updateTimeLeft(ms: number) {
        timeInTheFuture = Date.now() + ms;
    }

    private static handleMetaChange(key: string, newValue: any): void {
        if (key !== 'isDead') {
            return;
        }

        if (newValue) {
            if (!interval) {
                interval = Timer.createInterval(InternalFunctions.tick, 0, 'death.ts');
            }

            native.animpostfxPlay('DeathFailOut', 0, false);
            native.playSoundFrontend(-1, 'Bed', 'WastedSounds', true);
            return;
        }

        if (interval) {
            Timer.clearInterval(interval);
            interval = undefined;
        }

        native.animpostfxStop('DeathFailOut');
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
    }

    private static tick() {
        if (!alt.Player.local.vehicle) {
            if (!native.isPedRagdoll(alt.Player.local.scriptID)) {
                native.setPedToRagdoll(alt.Player.local.scriptID, -1, -1, 0, false, false, false);
            }
        }

        const timeLeft = timeInTheFuture - Date.now();
        if (timeLeft > 0) {
            drawText2D(
                `${(timeLeft / 1000).toFixed(2)}s Until Respawn`,
                { x: 0.5, y: 0.2 },
                0.5,
                new alt.RGBA(255, 255, 255, 255),
            );
        } else {
            drawText2D(
                `/acceptdeath - To Trigger Respawn`,
                { x: 0.5, y: 0.2 },
                0.5,
                new alt.RGBA(255, 255, 255, 255),
                0,
            );
        }
    }
}

InternalFunctions.init();
