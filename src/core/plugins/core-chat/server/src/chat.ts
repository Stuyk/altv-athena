import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { CHAT_CONFIG } from '../../shared/config';

function handleMessage(player: alt.Player, msg: string) {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    const closestPlayers = Athena.get.players.inRange(player.pos, CHAT_CONFIG.settings.range);
    Athena.systems.messenger.players.send(closestPlayers, `${data.name}: ${msg}`);
}

export function init() {
    Athena.systems.messenger.messages.addCallback(handleMessage);
}
