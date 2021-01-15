import * as alt from 'alt-client';
import * as native from 'natives';
import { Player_Status } from '../../shared/enums/player';
import { distance2d } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { showNotification } from '../utility/notification';
import { HelpController } from '../views/hud/controllers/helpController';
import { VehicleController } from './vehicle';

const MAX_INTERACTION_DRAW = 3; // Draws the key to press near the object.
const MAX_CHECKPOINT_DRAW = 4;
const TIME_BETWEEN_CHECKS = 1000;

export class InteractionController {
    static tick: number;
    static isOn: boolean = false;
    static pressedKey: boolean = false;
    static nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;

    static triggerInteraction(): void {
        InteractionController.pressedKey = true;
    }

    static toggleInteractionText(): void {
        alt.Player.local.isInteractionTextOff = !alt.Player.local.isInteractionTextOff ? true : false;
        showNotification(`Interaction Text ~y~${alt.Player.local.isInteractionTextOff ? 'Off' : 'On'}`);
    }

    static toggleInteractionMode(): void {
        if (InteractionController.tick) {
            alt.clearInterval(InteractionController.tick);
            InteractionController.tick = null;
        }

        InteractionController.isOn = !InteractionController.isOn;
        if (!InteractionController.isOn) {
            alt.Player.local.isInteractionOn = false;
            return;
        }

        alt.Player.local.isInteractionOn = true;
        InteractionController.tick = alt.setInterval(InteractionController.handleInteractionMode, 0);
    }

    static handleInteractionMode() {
        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.meta.isDead) {
            return;
        }

        if (!alt.Player.local.closestInteraction) {
            VehicleController.runVehicleControllerTick();
        } else {
            if (InteractionController.nextKeyPress > Date.now()) {
                return;
            }

            const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
            if (dist > MAX_CHECKPOINT_DRAW) {
                return;
            }

            const intPos = alt.Player.local.closestInteraction.position;
            drawMarker(28, intPos, new alt.Vector3(0.1, 0.1, 0.1), new alt.RGBA(255, 255, 255, 200));

            if (dist < MAX_INTERACTION_DRAW) {
                HelpController.updateHelpText(KEY_BINDS.INTERACT, `Interact with Object`, null);

                if (InteractionController.pressedKey) {
                    InteractionController.pressedKey = false;
                    InteractionController.nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
                    alt.emitServer(Player_Status.Interact, alt.Player.local.closestInteraction.type);
                }
            }
        }
    }
}
