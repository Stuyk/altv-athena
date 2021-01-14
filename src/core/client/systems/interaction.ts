import * as alt from 'alt-client';
import * as native from 'natives';
import { Player_Status } from '../../shared/enums/player';
import { distance2d } from '../../shared/utility/vector';
import { drawMarker } from '../utility/marker';
import { showNotification } from '../utility/notification';
import { drawText2D, imDrawText3D } from '../utility/text';
import { handleVehicleSystemTick } from './vehicle';

const MAX_INTERACTION_DRAW = 3; // Draws the key to press near the object.
const MAX_CHECKPOINT_DRAW = 50;

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

    // Add Additional Interaction Based Loops Here
    handleVehicleSystemTick();

    if (!alt.Player.local.closestInteraction) {
        drawText2D('Looking for closest object...', { x: 0.5, y: 0.95 }, 0.3, new alt.RGBA(255, 255, 255, 200));
        return;
    }

    const dist = distance2d(alt.Player.local.pos, alt.Player.local.closestInteraction.position);

    if (dist > MAX_CHECKPOINT_DRAW) {
        return;
    }

    drawMarker(1, alt.Player.local.closestInteraction.position, new alt.Vector3(1, 1, 1), new alt.RGBA(255, 0, 0, 100));
    drawText2D(
        `Interaction ~y~(${alt.Player.local.closestInteraction.type.toUpperCase()})`,
        { x: 0.5, y: 0.95 },
        0.3,
        new alt.RGBA(255, 255, 255, 200)
    );

    if (dist < MAX_INTERACTION_DRAW) {
        const objectHeightPosition = {
            x: alt.Player.local.closestInteraction.position.x,
            y: alt.Player.local.closestInteraction.position.y,
            z: alt.Player.local.closestInteraction.position.z + 1
        } as alt.Vector3;

        imDrawText3D(`[${String.fromCharCode(69)}] - Use`, objectHeightPosition, 0.4, new alt.RGBA(255, 255, 255, 200));

        if (pressedKey) {
            pressedKey = false;
            alt.emitServer(Player_Status.Interact, alt.Player.local.closestInteraction.type);
        }
    }
}
