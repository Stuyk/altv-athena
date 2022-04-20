import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import Logger from '../../../server/utility/athenaLogger';
import config from './config';
import './src/commands';
import { DiscordController } from './src/DiscordController';

const PLUGIN_NAME = 'Discord Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    if (!config.token) {
        Logger.error(`Missing config.token for Discord Bot.`);
        return;
    }

    DiscordController.populateEndpoints();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
