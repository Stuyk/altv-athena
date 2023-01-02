import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER_CLIENT } from '@AthenaShared/enums/athenaEvents';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';
import { ClientEvents } from './clientEvents';

alt.onClient(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, (player: alt.Player, pos: alt.IVector3) => {
    if (!player || !player.valid) {
        return;
    }

    player.currentWaypoint = pos;
    player.setSyncedMeta(PLAYER_SYNCED_META.WAYPOINT, pos);
    ClientEvents.trigger(ATHENA_EVENTS_PLAYER_CLIENT.WAYPOINT, player, pos);
});
