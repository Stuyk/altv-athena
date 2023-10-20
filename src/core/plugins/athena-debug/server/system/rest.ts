import * as Athena from '@AthenaServer/api/index.js';
import * as alt from 'alt-server';
import http from 'http';
import { DebugKeys } from './keys.js';

const port = 7790;

let server: http.Server;

function toJSON(data: any): string {
    return JSON.stringify(data, null, '\t');
}

const InternalFunctions = {
    async post(req: http.IncomingMessage, res: http.ServerResponse) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        await new Promise((resolve: Function) => {
            req.on('end', () => {
                resolve();
            });
        });

        const postRequest = JSON.parse(body);
        if (!postRequest) {
            res.writeHead(400, 'not okay');
            return res.end(JSON.stringify({ status: false }));
        }

        res.writeHead(200, 'okay');
        return res.end(JSON.stringify({ status: true }));
    },
    response(req: http.IncomingMessage, res: http.ServerResponse) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
        res.setHeader('Access-Control-Max-Age', 60 * 60 * 24 * 30);
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'POST') {
            return InternalFunctions.post(req, res);
        }

        if (req.method !== 'GET') {
            return res.end(toJSON({ error: http.STATUS_CODES[405] }));
        }

        if (typeof InternalFunctions[req.url] !== 'function') {
            return res.end(toJSON({ error: http.STATUS_CODES[405] }));
        }

        return InternalFunctions[req.url](res);
    },
    '/': (res: http.ServerResponse) => {
        return res.end(toJSON({ routes: Object.keys(InternalFunctions).filter((x) => x !== 'response') }));
    },
    '/players': (res: http.ServerResponse) => {
        const players = Athena.getters.players.online().map((player) => {
            const data = Athena.document.character.get(player);
            return {
                id: player.id,
                pos: player.pos,
                rot: player.rot,
                vehicle: player.vehicle,
                armour: player.armour,
                hp: player.health,
                model: player.model,
                data,
                ...player,
            };
        });

        return res.end(toJSON(players));
    },
    '/vehicles': (res: http.ServerResponse) => {
        const vehicles = [...alt.Vehicle.all]
            .filter((x) => x && x.valid)
            .map((vehicle) => {
                const data = Athena.document.vehicle.get(vehicle);
                return {
                    id: vehicle.id,
                    pos: vehicle.pos,
                    rot: vehicle.rot,
                    bodyHealth: vehicle.bodyHealth,
                    engineHealth: vehicle.engineHealth,
                    model: vehicle.model,
                    ...vehicle,
                    data: data ? data : {},
                };
            });

        return res.end(toJSON(vehicles));
    },
    '/update': (res: http.ServerResponse) => {
        let result = DebugKeys.getLastPosition();
        return res.end(toJSON(result));
    },
    '/memory': (res: http.ServerResponse) => {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        return res.end(toJSON(used));
    },
};

const RestServiceConst = {
    init() {
        if (!server) {
            server = http.createServer(InternalFunctions.response);
            server.listen(port, () => {
                alt.log(`~c~Dev Toolkit Started`);
                alt.log(`~c~https://athenaframework.com/tools/toolkit`);
            });
        }
    },
};

export const RestService = {
    ...RestServiceConst,
};
