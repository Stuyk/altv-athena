import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../shared/enums/system';
import { IConfig } from './interface/iConfig';
import Ares from './utility/ares';
import Logger from './utility/athenaLogger';
import ConfigUtil from './utility/config';
import MongoUtil from './utility/mongo';
import { ReconnectHelper } from './utility/reconnect';

const DEFAULT_ARES_ENDPOINT = 'https://ares.stuyk.com';
const startTime = Date.now();
let config: IConfig;

class Startup {
    static async begin() {
        // Validate the Configuration
        config = ConfigUtil.get();

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
        const collections = MongoUtil.getCollections();

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
        Ares.setAresEndpoint(config.ARES_ENDPOINT ? config.ARES_ENDPOINT : DEFAULT_ARES_ENDPOINT);
        await import(`./boot.js`);
        Logger.info(`==> Total Bootup Time -- ${Date.now() - startTime}ms`);
    }

    static async toggleEntry() {
        alt.off('playerConnect', Startup.handleEarlyConnect);
        Logger.info(`Server Warmup Complete. Now accepting connections.`);
        ReconnectHelper.invoke();
    }

    static handleEarlyConnect(player: alt.Player) {
        if (!(player instanceof alt.Player) || !player || !player.valid) {
            return;
        }

        try {
            player.kick('[Athena] Connected too early. Server still warming up.');
        } catch (err) {
            alt.log(`[Athena] A reconnection event happened too early. Try again.`);
        }
    }
}

process.on('uncaughtException', (err) => {
    console.log(err);
});

alt.on('playerConnect', Startup.handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, Startup.toggleEntry);

Startup.begin();
