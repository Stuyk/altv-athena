import * as alt from 'alt-server';
import { ATHENA_DEBUG_EVENTS } from '../../shared/events';
import { WebSocketClient } from './ws';

export class Keys {
    static init() {
        alt.onClient(ATHENA_DEBUG_EVENTS.ClientToServer.FORWARD, Keys.handleForwardData);
    }

    private static handleForwardData(player: alt.Player) {
        WebSocketClient.addToList(JSON.stringify(player.pos));
    }
}
