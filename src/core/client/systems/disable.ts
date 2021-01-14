import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';

alt.onServer(Events_Misc.StartTicks, handleStart);

let interval;

function handleStart() {
    interval = alt.setInterval(disableDefaultBehavior, 0);
}

function disableDefaultBehavior(): void {
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
