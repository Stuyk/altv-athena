import * as http from 'http';
import * as SockJS from 'sockjs';
let main;
if (SockJS['default']) {
    main = SockJS['default'].createServer();
} else {
    main = SockJS.createServer();
}
const server = http.createServer();
const StreamRange = {};
let StreamData = {};
let conn;
let config = {
    TimeBetweenUpdates: 1000,
};
class StreamerServer {
    /**
     * @static
     * @param {SockJS.Connection} conn
     * @memberof StreamerServer
     */ static init(_conn) {
        conn = _conn;
        conn.on('data', StreamerServer.receive);
    }
    /**
     * @static
     * @param {string} message
     * @memberof StreamerServer
     */ static receive(message) {
        /** @type {{id: number, route: string, data: Object}} */ const msg = JSON.parse(message);
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
    static config(id, data) {
        config = data;
        // console.log(`=== Streamer Configuration ===`);
        // Object.keys(config).forEach((key) => {
        //     console.log(`${key}: ${config[key]}`);
        // });
        conn.write(
            JSON.stringify({
                id: -1,
                route: 'ready',
                data: '[Streamer] Ready!',
            }),
        );
    }
    /**
     * Retrieve a ping request, send a pong.
     * @static
     * @param {number} id
     * @param {string} data
     * @memberof StreamerServer
     */ static ping(id) {
        StreamData = {};
        conn.write(
            JSON.stringify({
                id,
                route: 'pong',
                data: '[Streamer] Cleaned & Ready for Events!',
            }),
        );
    }
    /**
     * Retrieve a ping request, send a pong.
     * @static
     * @param {number} id
     * @param {{ locations: Array<> }} data
     * @memberof StreamerServer
     */ static populate(id, data) {
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
     */ static updateRange(id, data) {
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
     */ static update(id, data) {
        const keys = Object.keys(StreamData);
        const response = {
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
            const validData = StreamData[key].filter((streamData) => {
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
    static distance(vector1, vector2) {
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
StreamerServer.Routes = {
    ping: StreamerServer.ping,
    config: StreamerServer.config,
    populate: StreamerServer.populate,
    update: StreamerServer.update,
    'update-range': StreamerServer.updateRange,
};
main.on('connection', StreamerServer.init);
main.installHandlers(server);
server.listen(3399, '0.0.0.0');
