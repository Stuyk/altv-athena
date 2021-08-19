import * as http from 'http';
import * as SockJS from 'sockjs';
import {
    IStream,
    IStreamConfig,
    IStreamMessage,
    IStreamPopulate,
    IStreamUpdate
} from '../core/shared/interfaces/IStream';
import { Vector3 } from '../core/shared/interfaces/Vector';

const main = SockJS.createServer();
const server = http.createServer();
const StreamData: IStream = {
    markers: [],
    labels: [],
    objects: [],
    peds: []
};

let conn: SockJS.Connection;
let config: IStreamConfig = {
    TimeBetweenUpdates: 1000,
    LabelsDistance: 100,
    MarkersDistance: 100,
    ObjectsDistance: 100,
    PedsDistance: 100
};

class StreamerServer {
    static Routes = {
        ping: StreamerServer.ping,
        config: StreamerServer.config,
        populate: StreamerServer.populate,
        update: StreamerServer.update
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

        if (!StreamData[data.key]) {
            console.warn(`Key: ${data.key} does not exist for StreamData. Did not append data.`);
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

        const markers = StreamData.markers.filter((marker) => {
            if (marker.dimension && marker.dimension !== data.dimension) {
                return false;
            }

            if (StreamerServer.distance(data.pos, marker.pos) > config.MarkersDistance) {
                return false;
            }

            return true;
        });

        const labels = StreamData.labels.filter((label) => {
            if (label.dimension && label.dimension !== data.dimension) {
                return false;
            }

            if (StreamerServer.distance(data.pos, label.pos) > config.LabelsDistance) {
                return false;
            }

            return true;
        });

        const objects = StreamData.objects.filter((object) => {
            if (object.dimension && object.dimension !== data.dimension) {
                return false;
            }

            if (StreamerServer.distance(data.pos, object.pos) > config.ObjectsDistance) {
                return false;
            }

            return true;
        });

        const peds = StreamData.peds.filter((ped) => {
            if (ped.dimension && ped.dimension !== data.dimension) {
                return false;
            }

            if (StreamerServer.distance(data.pos, ped.pos) > config.PedsDistance) {
                return false;
            }

            return true;
        });

        const response: IStreamMessage = {
            id,
            route: 'update',
            data: {
                markers,
                labels,
                objects,
                peds
            }
        };

        conn.write(JSON.stringify(response));
    }

    static distance(vector1: Vector3, vector2: Vector3) {
        if (vector1 === undefined || vector2 === undefined) {
            throw new Error('AddVector => vector1 or vector2 is undefined');
        }

        return Math.sqrt(
            Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
        );
    }
}

main.on('connection', StreamerServer.init);
main.installHandlers(server);
server.listen(3399, '10.8.0.2');
