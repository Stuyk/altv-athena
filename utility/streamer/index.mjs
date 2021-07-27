import * as http from 'http';
import * as SockJS from 'sockjs';

const main = SockJS.createServer();
const server = http.createServer();

/** @type {SockJS.Connection} */
let conn;

class StreamerServer {
    static Routes = {
        ping: StreamerServer.ping
    };

    /**
     * @static
     * @param {SockJS.Connection} conn
     * @memberof StreamerServer
     */
    static init(_conn) {
        conn = _conn;
        conn.on('data', StreamerServer.receive);
    }

    /**
     * @static
     * @param {string} message
     * @memberof StreamerServer
     */
    static receive(message) {
        /** @type {{id: number, route: string, data: Object}} */
        const msg = JSON.parse(message);
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

    /**
     * Retrieve a ping request, send a pong.
     * @static
     * @param {number} id
     * @param {string} data
     * @memberof StreamerServer
     */
    static ping(id, data) {
        conn.write(JSON.stringify({ id, route: 'pong', data: '[Streamer] Ready for Events!' }));
    }

    /**
     *
     *
     * @static
     * @param {Buffer} message
     * @memberof SteamerServer
     */
    static message(message) {}
}

main.on('connection', StreamerServer.init);
main.installHandlers(server);
server.listen(3399, '0.0.0.0');
