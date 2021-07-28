import * as alt from 'alt-server';
import SockJS from 'sockjs-client';
import Logger from '../utility/athenaLogger';
import { MarkerController } from './marker';
import { TextLabelController } from './textlabel';
import { IStream, IStreamMessage } from '../../shared/interfaces/IStream';
import { DEFAULT_CONFIG } from '../athena/main';
import { ObjectController } from './object';

const DEFAULT_CONNECTION = 'http://127.0.0.1:3399';
const sock = new SockJS(DEFAULT_CONNECTION);
let ready = false;

export class StreamerService {
    static Routes = {
        pong: StreamerService.pong,
        update: StreamerService.update
    };

    static init() {
        Logger.info(`Connected to Streamer Service`);
        const pingMessage: IStreamMessage = {
            id: -1,
            route: 'ping',
            data: 'Ready!'
        };

        sock.send(JSON.stringify(pingMessage));

        Logger.info('Setting Up Configuration');
        const configMessage: IStreamMessage = {
            id: -1,
            route: 'config',
            data: DEFAULT_CONFIG.STREAM_CONFIG
        };

        sock.send(JSON.stringify(configMessage));
    }

    static requestUpdate(player: alt.Player) {
        const playerInfo: IStreamMessage = {
            id: player.id,
            route: 'update',
            data: {
                pos: player.pos
            }
        };

        sock.send(JSON.stringify(playerInfo));
    }

    /**
     * Stream Update Response from Streamer Service
     * @static
     * @param {number} id
     * @param {IStream} data
     * @return {*}
     * @memberof StreamerService
     */
    static update(id: number, data: IStream) {
        const player = alt.Player.all.find((p) => p.id === id);
        if (!player || !player.valid) {
            return;
        }

        MarkerController.update(player, data.markers);
        TextLabelController.update(player, data.labels);
        ObjectController.update(player, data.objects);
    }

    /**
     * Message back from sending a ping request.
     * @static
     * @param {string} data
     * @memberof StreamerService
     */
    static async pong(id: number, data: string) {
        Logger.info(data);
        ready = true;
    }

    /**
     * Populates Stream Data for External Process
     * @static
     * @template T
     * @param {string} key
     * @param {Array<T>} array
     * @memberof StreamerService
     */
    static async updateData<T>(key: string, array: Array<T>) {
        await new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!ready) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 100);
        });

        const streamInfo: IStreamMessage = {
            id: -1,
            route: 'populate',
            data: {
                array,
                key
            }
        };

        sock.send(JSON.stringify(streamInfo));
    }

    /**
     * Parse Data from the WebSocket Server
     * @static
     * @param {string} message
     * @return {*}
     * @memberof StreamerService
     */
    static receive(message: string) {
        const msg: IStreamMessage = JSON.parse(message);
        if (!StreamerService.Routes[msg.route]) {
            return;
        }

        StreamerService.Routes[msg.route](msg.id, msg.data);
    }

    static tick() {
        alt.Player.all.forEach((player) => {
            if (!player || !player.valid || !player.data) {
                return;
            }

            StreamerService.requestUpdate(player);
        });
    }
}

sock.onopen = StreamerService.init;
sock.onmessage = (message: MessageEvent<any>) => {
    StreamerService.receive(message.data);
};

alt.setInterval(StreamerService.tick, DEFAULT_CONFIG.STREAM_CONFIG.TimeBetweenUpdates);
