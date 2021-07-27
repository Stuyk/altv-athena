import * as alt from 'alt-server';
import SockJS from 'sockjs-client';
import Logger from '../utility/athenaLogger';
import { MarkerController } from './marker';
import { TextLabelController } from './textlabel';
import { IStream, IStreamMessage } from '../../shared/interfaces/IStream';

const DEFAULT_CONNECTION = 'http://127.0.0.1:3399';
const sock = new SockJS(DEFAULT_CONNECTION);

export class StreamerService {
    static Routes = {
        pong: StreamerService.pong,
        update: StreamerService.update
    };

    static init() {
        Logger.info(`Connected to Streamer Service`);
        const data: IStreamMessage = {
            id: -1,
            route: 'ping',
            data: 'Ready!'
        };

        sock.send(JSON.stringify(data));
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
    }

    /**
     * Message back from sending a ping request.
     * @static
     * @param {string} data
     * @memberof StreamerService
     */
    static async pong(id: number, data: string) {
        // Populate Markers
        const markers = await MarkerController.get();
        const markerStreamInfo: IStreamMessage = {
            id: -1,
            route: 'populate',
            data: {
                array: markers,
                key: 'markers'
            }
        };

        sock.send(JSON.stringify(markerStreamInfo));

        // Populate Text Labels
        const textLabels = await TextLabelController.get();
        const textlabelStreamInfo: IStreamMessage = {
            id: -1,
            route: 'populate',
            data: {
                array: textLabels,
                key: 'labels'
            }
        };

        sock.send(JSON.stringify(textlabelStreamInfo));
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
}

sock.onopen = StreamerService.init;
sock.onmessage = (message: MessageEvent<any>) => {
    StreamerService.receive(message.data);
};
