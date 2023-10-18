import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api/index.js';
import { CHAT_CONFIG } from '../../shared/config.js';

function handleMessage(player: alt.Player, msg: string) {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    const closestPlayers = Athena.getters.players.inRange(player.pos, CHAT_CONFIG.settings.range);
    Athena.systems.messenger.messaging.sendToPlayers(closestPlayers, `${data.name}: ${msg}`);
}

export function init() {
    Athena.systems.messenger.messaging.addCallback(handleMessage);
}
