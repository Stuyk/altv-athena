import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import * as native from 'natives';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_TASK_MOVE, (pos: alt.Vector3) => {
    if (alt.Player.local.vehicle) {
        return;
    }

    native.taskGoToCoordAnyMeans(alt.Player.local.scriptID, pos.x, pos.y, pos.z, 1, 0, false, 786603, 0);
});
