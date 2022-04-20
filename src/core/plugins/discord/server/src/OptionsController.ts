import Database from '@stuyk/ezmongodb';
import alt from 'alt-server';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { defaultOptions, DiscordID, Options } from '../../../../server/interface/iOptions';
import config from '../config';

export class OptionsController {
    static data: Options = {};

    /**
     * Used to initialize options after loading.
     * @static
     * @memberof OptionsController
     */
    static async propagateOptions() {
        const databaseData = await Database.fetchAllData<Options>(Collections.Options);
        const currentOptions = !databaseData[0] ? defaultOptions : databaseData[0];

        Object.keys(currentOptions).forEach((key) => {
            OptionsController.data[key] = currentOptions[key];
        });

        if (!databaseData[0]) {
            OptionsController.data = await Database.insertData(OptionsController.data, Collections.Options, true);
        }

        if (config?.whitelist?.enabled) {
            alt.log(`~lg~[Discord] Whitelisted Users: ${OptionsController.data.whitelist.length}`);
        }
    }

    /**
     * Add a user to the whitelist group.
     * @static
     * @param {DiscordID} id
     * @memberof OptionsController
     */
    static async addToWhitelist(id: DiscordID) {
        const isWhitelisted = await OptionsController.isWhitelisted(id);

        if (isWhitelisted) {
            return;
        }

        OptionsController.data.whitelist.push(id);
        Database.updatePartialData(
            OptionsController.data._id,
            { whitelist: OptionsController.data.whitelist },
            Collections.Options,
        );
    }

    /**
     * Check if a user is whitelisted.
     * @static
     * @param {DiscordID} id
     * @return {*}  {boolean}
     * @memberof OptionsController
     */
    static isWhitelisted(id: DiscordID): boolean {
        const index = OptionsController.data.whitelist.findIndex((dID) => dID === id);

        if (index >= 0) {
            return true;
        }

        return false;
    }

    /**
     * Remove a discord id from the whitelist.
     * @static
     * @param {DiscordID} id
     * @return {*}  {boolean}
     * @memberof OptionsController
     */
    static removeFromWhitelist(id: DiscordID): boolean {
        const index = OptionsController.data.whitelist.findIndex((dID) => dID === id);

        if (index <= -1) {
            return false;
        }

        OptionsController.data.whitelist.splice(index, 1);
        Database.updatePartialData(
            OptionsController.data._id,
            { whitelist: OptionsController.data.whitelist },
            Collections.Options,
        );

        return true;
    }
}

OptionsController.propagateOptions();
