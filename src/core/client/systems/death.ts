import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Meta } from '../../shared/enums/meta';
import { drawText2D } from '../utility/text';

alt.on(Events_Meta.Changed, handleStreamedMetaChange);

const timeBetweenDeath = 30000;

let interval: number;
let deathTime: number;

function handleStreamedMetaChange(key: string, newValue: any, oldValue: any): void {
    if (key !== 'isDead') {
        return;
    }

    if (newValue) {
        if (!interval) {
            interval = alt.setInterval(handleDeathMovement, 0);
            deathTime = Date.now() + timeBetweenDeath;
        }
        return;
    }

    if (!interval) {
        return;
    }

    native.clearPedTasksImmediately(alt.Player.local.scriptID);
    alt.clearInterval(interval);
    interval = null;
}

function handleDeathMovement() {
    if (!native.isPedRagdoll(alt.Player.local.scriptID)) {
        native.setPedToRagdoll(alt.Player.local.scriptID, -1, -1, 0, false, false, false);
    }

    const timeLeft = deathTime - Date.now();
    if (timeLeft > 0) {
        drawText2D(
            `${(timeLeft / 1000).toFixed(2)}s Until Respawn`,
            { x: 0.5, y: 0.2 },
            0.5,
            new alt.RGBA(255, 255, 255, 255)
        );
    } else {
        drawText2D(`Now Respawning...`, { x: 0.5, y: 0.2 }, 0.5, new alt.RGBA(255, 255, 255, 255));
    }
}
