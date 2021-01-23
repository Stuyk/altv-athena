import * as alt from 'alt-client';
import { drawLine } from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance2d } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { drawText2D } from '../utility/text';
import { HelpController } from '../views/hud/controllers/helpController';
import { VehicleController } from './vehicle';

const MAX_INTERACTION_DRAW = 4; // Draws the key to press near the object.
const MAX_CHECKPOINT_DRAW = 8;
const TIME_BETWEEN_CHECKS = 1000;

export class InteractionController {
    static tick: number;
    static isOn: boolean = false;
    static pressedKey: boolean = false;
    static isAlwaysOn: boolean = false;
    static nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;

    static triggerInteraction(): void {
        InteractionController.pressedKey = true;
    }

    static toggleInteractionMode(): void {
        // Prevents clearing the interaction and is forced into being on all of the time.
        if (InteractionController.isAlwaysOn) {
            return;
        }

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
        InteractionController.isAlwaysOn = SHARED_CONFIG.INTERACTION_ALWAYS_ON;
        InteractionController.tick = alt.setInterval(InteractionController.handleInteractionMode, 0);
    }

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionController
     */
    static setInteractionInfo(type: string | null, position: alt.Vector3) {
        if (type === null) {
            alt.Player.local.closestInteraction = null;
            return;
        }

        alt.Player.local.closestInteraction = { type, position };
    }

    static handleInteractionMode() {
        if (alt.Player.local.isMenuOpen) {
            InteractionController.pressedKey = false;
            return;
        }

        if (alt.Player.local.isChatOpen) {
            InteractionController.pressedKey = false;
            return;
        }

        if (alt.Player.local.meta.isDead) {
            InteractionController.pressedKey = false;
            return;
        }

        drawText2D('Interaction Mode is On', { x: 0.5, y: 0.98 }, 0.3, new alt.RGBA(255, 255, 255, 255));

        // Non-Interaction Based Items
        // Vehicles and such...
        if (!alt.Player.local.closestInteraction) {
            VehicleController.runVehicleControllerTick();
            return;
        }

        // All Interaction Based Items
        // ATMs, Fuel Pumps, etc.
        if (InteractionController.nextKeyPress > Date.now()) {
            return;
        }

        const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
        if (dist > MAX_CHECKPOINT_DRAW) {
            return;
        }

        drawMarker(
            1,
            alt.Player.local.closestInteraction.position,
            new alt.Vector3(0.05, 0.05, 8),
            new alt.RGBA(0, 255, 0, 100)
        );

        if (dist < MAX_INTERACTION_DRAW) {
            HelpController.updateHelpText(KEY_BINDS.INTERACT, `Interact with Object`, null);

            if (InteractionController.pressedKey) {
                InteractionController.pressedKey = false;
                InteractionController.nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
                alt.emitServer(SYSTEM_EVENTS.INTERACTION, alt.Player.local.closestInteraction.type);
            }
        }
    }
}

if (SHARED_CONFIG.INTERACTION_ALWAYS_ON) {
    InteractionController.toggleInteractionMode();
}

alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.setInteractionInfo);
