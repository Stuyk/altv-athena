import * as alt from 'alt-client';
import * as native from 'natives';
import { drawText2D } from '../utility/text';
import { handleFrontendSound } from './sound';

const torsoData = {};
let torso = 0;
let top = 0;

alt.on('consoleCommand', (name) => {
    if (name !== 'torso') {
        return;
    }

    alt.setInterval(handleTorsoHelper, 0);
    alt.on('keyup', handleKey);
});

function handleTorsoHelper() {
    drawText2D(`Top: ${top} | Torso: ${torso}`, { x: 0.5, y: 0.95 }, 0.4, new alt.RGBA(255, 255, 255, 255));
}

function handleKey(key) {
    // Arrow Up
    if (key === 38) {
        top -= 1;
        if (top <= 0) {
            top = 0;
        }

        native.setPedComponentVariation(alt.Player.local.scriptID, 3, torso, 0, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, top, 0, 0);
        handleFrontendSound(`NAV_UP_DOWN`, `HUD_FREEMODE_SOUNDSET`);
        return;
    }

    // Arrow Down
    if (key === 40) {
        top += 1;
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, torso, 0, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, top, 0, 0);
        handleFrontendSound(`NAV_UP_DOWN`, `HUD_FREEMODE_SOUNDSET`);
        return;
    }

    // Right
    if (key === 39) {
        torso += 1;
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, torso, 0, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, top, 0, 0);
        handleFrontendSound(`NAV_LEFT_RIGHT`, `HUD_FREEMODE_SOUNDSET`);
        return;
    }

    // Left
    if (key === 37) {
        torso -= 1;
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, torso, 0, 0);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, top, 0, 0);
        handleFrontendSound(`NAV_LEFT_RIGHT`, `HUD_FREEMODE_SOUNDSET`);
        return;
    }

    // Append - Space
    if (key === 32) {
        if (!torsoData[top]) {
            torsoData[top] = [torso];
            return;
        }

        torsoData[top].push(torso);
        handleFrontendSound('SELECT', 'HUD_FREEMODE_SOUNDSET');
        return;
    }

    // Append - Space
    if (key === 8) {
        const index = torsoData[top].findIndex((x) => x === torso);
        if (index <= -1) {
            return;
        }

        handleFrontendSound(`SELECT`, `DLC_HEIST_HACKING_SNAKE_SOUNDS`);
        torsoData[top].splice(index, 1);
        return;
    }

    if (key === 79) {
        console.log(JSON.stringify(torsoData, null, '\t'));
        handleFrontendSound(`SHOOTING_RANGE_ROUND_OVER`, `HUD_AWARDS`);
    }
}
