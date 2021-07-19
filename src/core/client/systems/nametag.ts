import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { distance2d } from '../../shared/utility/vector';
import { drawText2D } from '../utility/text';
import { Timer } from '../utility/timers';

const drawDistance = 50;
let interval;
let shouldScreenShake = false;

alt.onServer(SYSTEM_EVENTS.TICKS_START, handleStart);

function handleStart() {
    interval = Timer.createInterval(drawNametags, 0, 'nametag.ts');
    shouldScreenShake = SHARED_CONFIG.FORCE_SCREEN_SHAKE;
}

/**
 * Toggled on through an interval.
 */
function drawNametags() {
    native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false); // Used to fix a draw error.

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (SHARED_CONFIG.VOICE_ON && alt.Player.local.isTalking) {
        drawText2D('Microphone On', { x: 0.5, y: 0.05 }, 0.4, new alt.RGBA(255, 255, 255, 255));
    }

    if (shouldScreenShake) {
        if (alt.Player.local.isAiming) {
            if (!native.isGameplayCamShaking()) {
                native.shakeGameplayCam('HAND_SHAKE', 3);
            }
        } else {
            if (native.isGameplayCamShaking()) {
                native.stopGameplayCamShaking(true);
            }
        }
    }

    for (let i = 0, n = alt.Player.all.length; i < n; i++) {
        let player = alt.Player.all[i];
        if (!player.valid) {
            continue;
        }

        if (player.vehicle && alt.Player.local.vehicle !== player.vehicle) {
            continue;
        }

        if (player.scriptID === alt.Player.local.scriptID) {
            continue;
        }

        let name = player.getSyncedMeta('Name');
        if (!name || name === null || name === undefined) {
            continue;
        }

        name = name.replace('_', ' ');

        if (!name) {
            continue;
        }

        if (!native.hasEntityClearLosToEntity(alt.Player.local.scriptID, player.scriptID, 17)) {
            continue;
        }

        let dist = distance2d(player.pos, alt.Player.local.pos);
        if (dist > drawDistance) {
            player.inVisionTime = null;
            continue;
        }

        if (player.inVisionTime === null || (player.inVisionTime === undefined && isNaN(player.inVisionTime))) {
            player.inVisionTime = Date.now() + 5000;
        }

        if (Date.now() < player.inVisionTime) {
            name = '';
        }

        const isChatting = player.getSyncedMeta('Chatting');
        const pos = { ...native.getPedBoneCoords(player.scriptID, 12844, 0, 0, 0) };
        pos.z += 0.75;

        let scale = 1 - (0.8 * dist) / drawDistance;
        let fontSize = 0.6 * scale;

        const entity = player.vehicle ? player.vehicle.scriptID : player.scriptID;
        const vector = native.getEntityVelocity(entity);
        const frameTime = native.getFrameTime();

        // Names
        native.setDrawOrigin(
            pos.x + vector.x * frameTime,
            pos.y + vector.y * frameTime,
            pos.z + vector.z * frameTime,
            0
        );

        const modifiedName = isChatting ? `(${player.id}) ${name}~r~*` : `(${player.id}) ${name}`;

        native.beginTextCommandDisplayText('STRING');
        native.setTextFont(4);
        native.setTextScale(fontSize, fontSize);
        native.setTextProportional(true);
        native.setTextCentre(true);
        native.setTextColour(255, 255, 255, 255);
        native.setTextOutline();
        native.addTextComponentSubstringPlayerName(modifiedName);
        native.endTextCommandDisplayText(0, 0, 0);
        native.clearDrawOrigin();
    }
}
