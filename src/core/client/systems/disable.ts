import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from 'core/shared/configurations/shared';
import { SYSTEM_EVENTS } from 'core/shared/enums/system';

alt.onServer(SYSTEM_EVENTS.TICKS_START, toggleOn);

let interval;

function toggleOn() {
    interval = alt.setInterval(disableDefaultBehavior, 0);
}

function disableDefaultBehavior(): void {
    // Disable default weapon switch
    for (let i = 157; i < 164; i++) {
        native.disableControlAction(0, i, true);
    }

    if (
        alt.Player.local.meta.food <= SHARED_CONFIG.FOOD_FATIGUE ||
        alt.Player.local.meta.water <= SHARED_CONFIG.WATER_FATIGUE
    ) {
        native.disableControlAction(0, 21, true);
    }

    // Disable Weapon Wheel
    native.disableControlAction(0, 12, true);
    native.disableControlAction(0, 13, true);
    native.disableControlAction(0, 14, true);
    native.disableControlAction(0, 15, true);

    // Disable Default Controls
    native.disableControlAction(0, 23, true); // F
    native.disableControlAction(0, 75, true); // F
    native.disableControlAction(0, 104, true); // H

    // Disable default vehicle behavior.
    if (native.isPedTryingToEnterALockedVehicle(alt.Player.local.scriptID)) {
        native.clearPedTasks(alt.Player.local.scriptID);
        native.clearPedSecondaryTask(alt.Player.local.scriptID);
    }
}
