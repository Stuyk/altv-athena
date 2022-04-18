import * as http from 'http';
import * as SockJS from 'sockjs';
import {
    IStream,
    IStreamConfig,
    IStreamMessage,
    IStreamPopulate,
    IStreamUpdate,
} from '../../../src/core/shared/interfaces/IStream';
import { Vector3 } from '../../../src/core/shared/interfaces/Vector';

let main;

if (SockJS['default']) {
    main = SockJS['default'].createServer();
} else {
    main = SockJS.createServer();
}

const server = http.createServer();
const StreamRange: { [key: string]: number } = {};
let StreamData: IStream = {};

let conn: SockJS.Connection;
let config: IStreamConfig = {
    TimeBetweenUpdates: 1000,
};

class StreamerServer {
    static Routes = {
        ping: StreamerServer.ping,
        config: StreamerServer.config,
        populate: StreamerServer.populate,
        update: StreamerServer.update,
        'update-range': StreamerServer.updateRange,
    };

    /**
     * @static
     * @param {SockJS.Connection} conn
     * @memberof StreamerServer
     */
    static init(_conn: SockJS.Connection) {
        conn = _conn;
        conn.on('data', StreamerServer.receive);
    }

    /**
     * @static
     * @param {string} message
     * @memberof StreamerServer
     */
    static receive(message: string) {
        /** @type {{id: number, route: string, data: Object}} */
        const msg: IStreamMessage = JSON.parse(message);
        if (!msg || !msg.route) {
            console.warn(`Got message with no route or information.`);
            return;
        }

        if (!StreamerServer.Routes[msg.route]) {
            console.warn(`No Streamer Route for ${msg.route}`);
            return;
        }

        StreamerServer.Routes[msg.route](msg.id, msg.data);
    }

    static config(id: number, data: IStreamConfig) {
        config = data;
        // console.log(`=== Streamer Configuration ===`);
        // Object.keys(config).forEach((key) => {
        //     console.log(`${key}: ${config[key]}`);
        // });

        conn.write(JSON.stringify({ id: -1, route: 'ready', data: '[Streamer] Ready!' }));
    }

    /**
     * Retrieve a ping request, send a pong.
     * @static
     * @param {number} id
     * @param {string} data
     * @memberof StreamerServer
     */
    static ping(id: number) {
        StreamData = {};
        conn.write(JSON.stringify({ id, route: 'pong', data: '[Streamer] Cleaned & Ready for Events!' }));
    }

    /**
     * Retrieve a ping request, send a pong.
     * @static
     * @param {number} id
     * @param {{ locations: Array<> }} data
     * @memberof StreamerServer
     */
    static populate(id: number, data: IStreamPopulate<any>) {
        if (!data) {
            return;
        }

        StreamData[data.key] = data.array;
    }

    /**
     * Updates the stream range for a key.
     * All stream ranges defaul to 100.
     * @static
     * @param {number} id
     * @param {{ key: string; range: number }} data
     * @return {*}
     * @memberof StreamerServer
     */
    static updateRange(id: number, data: { key: string; range: number }) {
        if (!data) {
            return;
        }

        StreamRange[data.key] = data.range;
    }

    /**
     * Retrieve all the closest elements based on position
     * @static
     * @param {number} id
     * @param {IStreamUpdate} data
     * @memberof StreamerServer
     */
    static update(id: number, data: IStreamUpdate) {
        const keys = Object.keys(StreamData);

        const response: IStreamMessage = {
            id,
            route: 'update',
            data: {},
        };

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (!StreamData[key]) {
                continue;
            }

            const streamDistance = StreamRange[key] ? StreamRange[key] : 100;
            const validData = StreamData[key].filter((streamData: IStreamUpdate) => {
                if (streamData.dimension && streamData.dimension !== data.dimension) {
                    return false;
                }

                if (StreamerServer.distance(streamData.pos, data.pos) > streamDistance) {
                    return false;
                }

                return true;
            });

            response.data[key] = validData;
        }

        conn.write(JSON.stringify(response));
    }

    static distance(vector1: Vector3, vector2: Vector3) {
        if (vector1 === undefined || vector2 === undefined) {
            throw new Error('AddVector => vector1 or vector2 is undefined');
        }

        return Math.sqrt(
            Math.pow(vector1.x - vector2.x, 2) +
                Math.pow(vector1.y - vector2.y, 2) +
                Math.pow(vector1.z - vector2.z, 2),
        );
    }
}

main.on('connection', StreamerServer.init);
main.installHandlers(server);
server.listen(3399, '0.0.0.0');
