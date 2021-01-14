import * as alt from 'alt-client';
import * as native from 'natives';
import { Player_Status } from '../../shared/enums/player';
import { distance2d } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { showNotification } from '../utility/notification';
import { drawText2D, imDrawText3D } from '../utility/text';
import { updateHelpText } from '../views/hud/hud';
import { VehicleController } from './vehicle';

const MAX_INTERACTION_DRAW = 3; // Draws the key to press near the object.
const MAX_CHECKPOINT_DRAW = 4;

let tick: number;
let isOn: boolean = false;
let pressedKey = false;

export function triggerInteraction(): void {
    pressedKey = true;
}

export function toggleInteractionText(): void {
    alt.Player.local.isInteractionTextOff = !alt.Player.local.isInteractionTextOff ? true : false;
    showNotification(`Interaction Text ~y~${alt.Player.local.isInteractionTextOff ? 'Off' : 'On'}`);
}

export function toggleInteractionMode(): void {
    if (tick) {
        alt.clearInterval(tick);
        tick = null;
    }

    isOn = !isOn;
    if (!isOn) {
        alt.Player.local.isInteractionOn = false;
        return;
    }

    alt.Player.local.isInteractionOn = true;
    tick = alt.setInterval(handleInteractionMode, 0);
}

function handleInteractionMode() {
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
        const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);
        if (dist > MAX_CHECKPOINT_DRAW) {
            return;
        }

        const intPos = alt.Player.local.closestInteraction.position;
        drawMarker(28, intPos, new alt.Vector3(0.1, 0.1, 0.1), new alt.RGBA(255, 255, 255, 200));

        if (dist < MAX_INTERACTION_DRAW) {
            updateHelpText(KEY_BINDS.INTERACT, `Interact with Object`, null);
            if (pressedKey) {
                pressedKey = false;
                alt.emitServer(Player_Status.Interact, alt.Player.local.closestInteraction.type);
            }
        }
    }
}
