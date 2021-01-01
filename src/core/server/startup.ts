import * as alt from 'alt-server';
import { Events_Misc } from '../shared/enums/events';

import './athena/index';

alt.on('playerConnect', handleEarlyConnect);
alt.on(Events_Misc.EnableEntry, handleEntryToggle);

function handleEntryToggle() {
    alt.off('playerConnect', handleEarlyConnect);
    alt.log(`[Athena] Server Warmup Complete. Now taking connections.`);
}

function handleEarlyConnect(player: alt.Player) {
    if (!(player instanceof alt.Player)) {
        return;
    }

    if (!player) {
        return;
    }

    player.kick('Connected too early. Sever still warming up.');
}
