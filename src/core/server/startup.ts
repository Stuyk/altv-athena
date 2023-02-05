import * as alt from 'alt-server';

import ConfigUtil from './utility/config';
import Database from '@stuyk/ezmongodb';
import MongoUtil from './utility/mongo';

import { SYSTEM_EVENTS } from '../shared/enums/system';
import { IConfig } from './interface/iConfig';
import { ReconnectHelper } from './utility/reconnect';

const startTime = Date.now();
let config: IConfig | undefined;

class Startup {
    static async begin() {
        config = ConfigUtil.get();
        Startup.database();
        await Startup.load();
    }

    /**
     * Used to start the Database.
     * @static
     * @memberof Startup
     */
    static database() {
        if (typeof config === 'undefined') {
            alt.logWarning(
                `Failed to load Configuration File. Is 'AthenaConfig.json' file malformed? Try setting to default values again.`,
            );
            process.exit(1);
        }

        const url = MongoUtil.getURL(config);
        const collections = MongoUtil.getCollections();

        Database.init(url, MongoUtil.getName(config), collections)
            .catch(() => {
                MongoUtil.throwConnectionError();
            })
            .then((res) => {
                if (res) {
                    alt.log(`MongoDB connection was established.`);
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

alt.on('playerConnect', Startup.handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, Startup.toggleEntry);

Startup.begin();
