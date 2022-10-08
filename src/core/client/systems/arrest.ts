import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Timer } from '../utility/timers';
import { playAnimation } from './animations';

let interval: number;
let cuffer: alt.Player;

const ArrestController = {
    cuff(_cuffer: alt.Player) {
        if (interval) {
            Timer.clearInterval(interval);
            interval = null;
        }

        cuffer = _cuffer;
        Timer.createInterval(ArrestController.handleCuff, 500, 'arrest.ts');
    },

    uncuff(target: alt.Player) {},

    async handleCuff() {
        if (!cuffer || !cuffer.valid) {
            Timer.clearInterval(interval);
            interval = null;
            return;
        }

        if (!native.isEntityPlayingAnim(alt.Player.local.scriptID, 'mp_arresting', 'idle', 3)) {
            await playAnimation('mp_arresting', 'idle', 49);
        }

        const fwd = native.getEntityForwardVector(cuffer);
        const pos = {
            x: cuffer.pos.x - fwd.x * 1,
            y: cuffer.pos.y - fwd.y * 1,
            z: cuffer.pos.z,
        };

        native.taskGoToCoordAnyMeans(alt.Player.local.scriptID, pos.x, pos.y, pos.z, 2, 0, false, 786603, 0);
    },
};

alt.onServer(SYSTEM_EVENTS.PLAYER_CUFF, ArrestController.cuff);
alt.onServer(SYSTEM_EVENTS.PLAYER_UNCUFF, ArrestController.uncuff);
