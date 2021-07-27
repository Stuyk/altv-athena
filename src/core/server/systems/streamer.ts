import * as alt from 'alt-server';
import SockJS from 'sockjs-client';
import Logger from '../utility/athenaLogger';

const DEFAULT_CONNECTION = 'http://127.0.0.1:3399';
const sock = new SockJS(DEFAULT_CONNECTION);

interface IMessage {
    id: number;
    route: string;
    data: Object;
}

class StreamerService {
    static Routes = {
        pong: StreamerService.pong
    };

    static init() {
        Logger.info(`Connected to Streamer Service`);
        const data: IMessage = {
            id: -1,
            route: 'ping',
            data: 'Ready!'
        };

        sock.send(JSON.stringify(data));
    }

    /**
     * Message back from sending a ping request.
     * @static
     * @param {string} data
     * @memberof StreamerService
     */
    static pong(data: string) {
        Logger.info(data);
    }

    /**
     * Parse Data from the WebSocket Server
     * @static
     * @param {string} message
     * @return {*}
     * @memberof StreamerService
     */
    static receive(message: string) {
        const msg: IMessage = JSON.parse(message);
        if (!StreamerService.Routes[msg.route]) {
            return;
        }

        StreamerService.Routes[msg.route](msg.data);
    }
}

sock.onopen = StreamerService.init;
sock.onmessage = (message: MessageEvent<any>) => {
    StreamerService.receive(message.data);
};
