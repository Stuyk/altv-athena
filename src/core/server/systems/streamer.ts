import * as alt from 'alt-server';
import SockJS from 'sockjs-client';
import Logger from '../utility/athenaLogger';
import { IStream, IStreamMessage } from '../../shared/interfaces/IStream';
import { DEFAULT_CONFIG } from '../athena/main';

const DEFAULT_CONNECTION = 'http://127.0.0.1:3399';
const sock = new SockJS(DEFAULT_CONNECTION);
const callbacks: { [key: string]: (player: alt.Player, streamedData: Array<any>) => void } = {};
let ready = false;

export class StreamerService {
    static Routes = {
        pong: StreamerService.pong,
        update: StreamerService.update,
    };

    static init() {
        Logger.info(`Connected to Streamer Service`);
        const pingMessage: IStreamMessage = {
            id: -1,
            route: 'ping',
            data: 'Ready!',
        };

        sock.send(JSON.stringify(pingMessage));

        Logger.info('Setting Up Configuration');
        const configMessage: IStreamMessage = {
            id: -1,
            route: 'config',
            data: DEFAULT_CONFIG.STREAM_CONFIG,
        };

        sock.send(JSON.stringify(configMessage));
    }

    /**
     * Register a custom callback function.
     * When the key is updated with data it will come back through the callback.
     * @static
     * @template T
     * @param {string} key A unique key for this stream data.
     * @param {(player: alt.Player, streamedData: Array<T>) => void} callback
     * @param {number} range How far away should we look from the player's position.
     * @memberof StreamerService
     */
    static async registerCallback<T>(
        key: string,
        callback: (player: alt.Player, streamedData: Array<T>) => void,
        range: number = 100,
    ) {
        callbacks[key] = callback;

        await new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!ready) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 100);
        });

        const playerInfo: IStreamMessage = {
            id: -1,
            route: 'update-range',
            data: {
                key,
                range,
            },
        };

        sock.send(JSON.stringify(playerInfo));
    }

    static requestUpdate(player: alt.Player) {
        const playerInfo: IStreamMessage = {
            id: player.id,
            route: 'update',
            data: {
                pos: player.pos,
                dimension: player.dimension,
            },
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

        const keys = Object.keys(callbacks);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (!callbacks[key]) {
                continue;
            }

            if (!data[key]) {
                continue;
            }

            callbacks[key](player, data[key]);
        }
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
                key,
            },
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
sock.onmessage = (message: MessageEvent) => {
    StreamerService.receive(message.data);
};

alt.setInterval(StreamerService.tick, DEFAULT_CONFIG.STREAM_CONFIG.TimeBetweenUpdates);
