import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { CHAT_CONFIG } from './config';

function handleMessage(player: alt.Player, msg: string) {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    const closestPlayers = Athena.get.players.inRange(player.pos, CHAT_CONFIG.MAX_RANGE);
    console.log(closestPlayers);
    Athena.systems.messenger.players.send(closestPlayers, `${data.name}: ${msg}`);
}

export function init() {
    Athena.systems.messenger.register(handleMessage);
}
