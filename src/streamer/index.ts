import * as http from 'http';
import * as SockJS from 'sockjs';
import {
    IStream,
    IStreamConfig,
    IStreamMessage,
    IStreamPopulate,
    IStreamUpdate,
} from '../core/shared/interfaces/IStream';
import { Vector3 } from '../core/shared/interfaces/Vector';

const main = SockJS.createServer();
const server = http.createServer();
const DefaultKeys = ['markers', 'labels', 'objects', 'peds'];
const StreamData: IStream = {};

let conn: SockJS.Connection;
let config: IStreamConfig = {
    TimeBetweenUpdates: 1000,
    StreamDistance: 100,
};

class StreamerServer {
    static Routes = {
        ping: StreamerServer.ping,
        config: StreamerServer.config,
        populate: StreamerServer.populate,
        update: StreamerServer.update,
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
        console.log(`=== Streamer Configuration ===`);
        Object.keys(config).forEach((key) => {
            console.log(`${key}: ${config[key]}`);
        });
    }

    /**
     * Retrieve a ping request, send a pong.
     * @static
     * @param {number} id
     * @param {string} data
     * @memberof StreamerServer
     */
    static ping(id: number) {
        conn.write(JSON.stringify({ id, route: 'pong', data: '[Streamer] Ready for Events!' }));
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

            const validData = StreamData[key].filter((streamData: IStreamUpdate) => {
                if (streamData.dimension && streamData.dimension !== data.dimension) {
                    return false;
                }

                if (StreamerServer.distance(streamData.pos, data.pos) > config.StreamDistance) {
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
