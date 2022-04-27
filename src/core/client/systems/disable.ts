import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Timer } from '../utility/timers';
import { VehicleController } from './vehicle';

alt.onServer(SYSTEM_EVENTS.TICKS_START, toggleOn);

let interval: number | undefined;

function toggleOn() {
    interval = Timer.createInterval(disableDefaultBehavior, 0, 'disable.ts');
}

function disableDefaultBehavior(): void {
    native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);

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
    native.disableControlAction(0, 104, true); // H
    VehicleController.handleVehicleDisables();
}
