import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import env from 'dotenv';
import * as fs from 'fs';
import { SYSTEM_EVENTS } from '../shared/enums/system';
import { IConfig } from './interface/IConfig';
import Ares from './utility/ares';
import ConfigUtil from './utility/config';
import MongoUtil from './utility/mongo';
import Logger from './utility/athenaLogger';

const DEFAULT_ARES_ENDPOINT = 'https://ares.stuyk.com';

const startTime = Date.now();
const config = env.config().parsed as IConfig;

// const fPath = path.join(alt.getResourcePath(alt.resourceName), '/server/athena.wasm');

class Startup {
    static async begin() {
        // Validate the Configuration
        ConfigUtil.validate(config);

        // Start Database
        Startup.database();

        // Start Ares Connection Protocol
        await Startup.ares();
    }

    /**
     * Used to start the Database.
     * @static
     * @memberof Startup
     */
    static database() {
        const url = MongoUtil.getURL(config);
        const collections = MongoUtil.getCollections(config);

        Database.init(url, MongoUtil.getName(), collections)
            .catch(() => {
                MongoUtil.throwConnectionError();
            })
            .then((res) => {
                if (res) {
                    Logger.info(`MongoDB connection was established.`);
                    return;
                }

                MongoUtil.throwConnectionError();
            });
    }

    /**
     * Sets the current ares endpoint.
     * @static
     * @memberof Startup
     */
    static async ares() {
        // Setup Ares Endpoint
        await Ares.setAresEndpoint(config.ARES_ENDPOINT ? config.ARES_ENDPOINT : DEFAULT_ARES_ENDPOINT);

        // Get the current Ares Version - For Version Debugging
        Ares.getVersion();
    }

    static async finish() {
        // const tmpPath = path.join(alt.getResourcePath(alt.resourceName), `/server/${name}.js`);
        // if (fs.existsSync(tmpPath)) {
        //     fs.unlinkSync(tmpPath);
        // }
        // This creates a list of files we need to import...;
        // for (let i = 0; i < data.length; i++) {
        //     fs.appendFileSync(tmpPath, `import '${data[i]}'; \r\n`);
        // }
        // // Import the dynamic file above.
        // import(`./${name}`).then(() => {
        //     fs.unlinkSync(tmpPath);
        // });
        // import('./utility/console');
        // import('./systems/options').then((res) => {
        //     res.default();
        // });
        // import('./systems/discord').then((res) => {
        //     res.default();
        // });
        // import('../plugins/imports').then((res) => {
        //     res.default(startTime);
        // });
    }
}

alt.on('playerConnect', handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

function handleEntryToggle() {
    alt.off('playerConnect', handleEarlyConnect);
    Logger.info(`Server Warmup Complete. Now accepting connections.`);
}

/**
 * Prevent early connections until server is warmed up.
 * @param {alt.Player} player
 * @return {*}  {void}
 */
function handleEarlyConnect(player: alt.Player): void {
    if (!(player instanceof alt.Player) || !player || !player.valid) {
        return;
    }

    try {
        player.kick('[Athena] Connected too early. Server still warming up.');
    } catch (err) {
        alt.log(`[Athena] A reconnection event happened too early. Try again.`);
    }
}

Startup.begin();
