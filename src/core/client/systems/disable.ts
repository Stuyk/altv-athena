import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { Timer } from '../utility/timers';

alt.onServer(SYSTEM_EVENTS.TICKS_START, toggleOn);

let interval;

function toggleOn() {
    interval = Timer.createInterval(disableDefaultBehavior, 0, 'disable.ts');
}

function disableDefaultBehavior(): void {
    native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);

    // Eventually this will probably get fixed. /shrug
    native.setHudComponentPosition(1, 1000.0, 1000.0); // STARS
    native.setHudComponentPosition(3, 1000.0, 1000.0); // WEP
    native.setHudComponentPosition(4, 1000.0, 1000.0); // CASH
    native.setHudComponentPosition(7, 1000.0, 1000.0); // AREA
    native.setHudComponentPosition(8, 1000.0, 1000.0); // VEHICLE CLASS
    native.setHudComponentPosition(9, 1000.0, 1000.0); // STREET

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
