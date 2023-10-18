import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';

import connection from './database/connection.js';
import reconnect from './utility/reconnect.js';
import serverConfig from './utility/config.js';
import { SYSTEM_EVENTS } from '../shared/enums/system.js';
import { IConfig } from './interface/iConfig.js';

const startTime = Date.now();
let config: IConfig | undefined;

class Startup {
    static async begin() {
        config = await serverConfig.get();
        Startup.database();
        await Startup.load();
    }

    /**
     * Used to start the Database.
     * @static
     *
     */
    static database() {
        if (typeof config === 'undefined') {
            alt.logWarning(
                `Failed to load Configuration File. Is 'AthenaConfig.json' file malformed? Try setting to default values again.`,
            );
            process.exit(1);
        }

        const url = connection.getURL(config);
        const collections = connection.getCollections();

        Database.init(url, connection.getName(config), collections)
            .catch(() => {
                connection.throwConnectionError();
            })
            .then((res) => {
                if (res) {
                    alt.log(`MongoDB connection was established.`);
                    return;
                }

                connection.throwConnectionError();
            });
    }

    /**
     * Sets the current ares endpoint.
     * @static
     *
     */
    static async load() {
        if (typeof config === 'undefined') {
            alt.logWarning(
                `Failed to load Configuration File. Is 'AthenaConfig.json' file malformed? Try setting to default values again.`,
            );
            process.exit(1);
        }

        // @ts-ignore
        await import(`./boot.js`);
        alt.log(`~lc~Boot Time: ~g~${Date.now() - startTime}ms`);
    }

    static async toggleEntry() {
        alt.off('playerConnect', Startup.handleEarlyConnect);
        reconnect.invoke();
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

alt.on('playerConnect', Startup.handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, Startup.toggleEntry);

Startup.begin();
