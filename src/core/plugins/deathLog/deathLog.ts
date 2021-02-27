import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../server/enums/athena';
import { EventController } from '../../server/systems/athenaEvent';

EventController.onPlayer(ATHENA_EVENTS_PLAYER.DIED, (player: alt.Player) => {
    alt.log(`[Death Log] ${player.data.name} has died.`);
});
