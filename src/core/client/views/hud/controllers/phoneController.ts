import * as alt from 'alt-client';
import * as native from 'natives';
import { BaseHUD } from '../hud';

export class PhoneController {
    static togglePhone() {
        BaseHUD.view.emit('phone:Toggle');
    }

    static animate(isActive: boolean) {
        if (alt.Player.local.vehicle) {
            return;
        }

        if (!isActive) {
            native.clearPedTasks(alt.Player.local.scriptID);
            return;
        }

        native.taskStartScenarioInPlace(alt.Player.local.scriptID, `WORLD_HUMAN_STAND_MOBILE`, 0, true);
    }
}
