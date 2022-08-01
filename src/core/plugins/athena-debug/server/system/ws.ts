import * as alt from 'alt-server';
import SockJS from 'sockjs-client';
import { Athena } from '../../../../server/api/athena';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';

const DEFAULT_CONNECTION = 'http://127.0.0.1:42069/debug';
let sock: WebSocket;
let ready = false;

interface DebuggerMessage {
    /**
     * Who is this message coming from. Usually a player identifier.
     *
     * @type {number}
     * @memberof DebuggerMessage
     */
    id: number;

    /**
     * What key is being propogated in the debugger
     *
     * @type {string}
     * @memberof DebuggerMessage
     */
    key: string;

    /**
     * What value is being propogated in the debugger
     *
     * @type {*}
     * @memberof DebuggerMessage
     */
    value: any;
}

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
class InternalController {
    /**
     * Send a ping message to the server and then send a configuration message.
     * @returns None
     */
    static init() {
        sock = new SockJS(DEFAULT_CONNECTION);

        sock.onclose = async () => {
            alt.logWarning(`[Debug Program] ==> Debug Plugin Reconnecting...`);
            sock.close();
            await alt.Utils.wait(1000);
            InternalController.init();
        };

        sock.onerror = async () => {
            alt.logWarning(`[Debug Program] ==> Debug Plugin Reconnecting...`);
            sock.close();
            await alt.Utils.wait(5000);
            InternalController.init();
        };

        sock.onopen = (ev: Event) => {
            if (ev.type === 'open') {
                alt.logWarning(`[Debug Program] ==> Connected to Debugger Program`);
                sock.send('ready');
                return;
            }
        };
    }

    static send(msg: DebuggerMessage) {
        sock.send(JSON.stringify(msg));
    }
}

export class WebSocketClient {
    static init() {
        InternalController.init();
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, WebSocketClient.handleSelect);
        alt.setInterval(WebSocketClient.handleGenericInfo, 250);
        alt.setInterval(WebSocketClient.handleCurrentInfo, 1000);
    }

    static registerEvent(type: 'server' | 'client') {
        //
    }

    static registerCallback() {
        //
    }

    static addToList(data: string) {
        if (!sock) {
            return;
        }

        alt.log(`Appending To List: ${data}`);
        sock.send(`APPEND-LIST--${data}`);
    }

    static log(message: string) {
        if (!sock) {
            return;
        }

        sock.send(`[${new Date(Date.now()).toLocaleTimeString()}] LOG--${message}`);
    }

    private static handleSelect(player: alt.Player) {
        const id = Athena.systems.identifier.getIdByStrategy(player);
        WebSocketClient.log(`(${id}) ${player.data.name} has Selected a Character`);
        InternalController.send({ id, key: 'account', value: player.accountData });
        InternalController.send({ id, key: 'data', value: player.data });
    }

    private static handleCurrentInfo() {
        alt.Player.all.forEach((player) => {
            if (!player || !player.valid || !player.data || !player.data._id) {
                return;
            }

            const id = Athena.systems.identifier.getIdByStrategy(player);
            InternalController.send({ id, key: 'data', value: player.data });
            InternalController.send({ id, key: 'account', value: player.accountData });

            // Append anything else you want to log here...
        });
    }

    private static handleGenericInfo() {
        alt.Player.all.forEach((player) => {
            if (!player || !player.valid || !player.data || !player.data._id) {
                return;
            }

            const id = Athena.systems.identifier.getIdByStrategy(player);
            InternalController.send({ id, key: 'pos', value: player.pos });
            InternalController.send({ id, key: 'rot', value: player.rot });
            InternalController.send({ id, key: 'health', value: player.health });
            InternalController.send({ id, key: 'armour', value: player.armour });
            InternalController.send({ id, key: 'vehicle', value: player.vehicle ? true : false });
            InternalController.send({ id, key: 'weapon', value: player.currentWeapon });
        });
    }
}
