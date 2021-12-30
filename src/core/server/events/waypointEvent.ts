import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER_CLIENT } from '../../shared/enums/athenaEvents';
import { Vector3 } from '../../shared/interfaces/vector';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { ClientEvents } from './clientEvents';

alt.onClient(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, (player: alt.Player, pos: Vector3) => {
    if (!player || !player.valid) {
        return;
    }

    player.currentWaypoint = pos;
    player.setSyncedMeta(PLAYER_SYNCED_META.WAYPOINT, pos);
    ClientEvents.trigger(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, player, pos);
});
