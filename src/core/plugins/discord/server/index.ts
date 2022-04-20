import * as alt from 'alt-server';
import { Account } from '../../../server/interface/iAccount';
import { LoginController } from '../../../server/systems/login';
import { PluginSystem } from '../../../server/systems/plugins';
import Logger from '../../../server/utility/athenaLogger';
import config from './config';
import './src/commands';
import { DiscordController } from './src/DiscordController';
import { OptionsController } from './src/OptionsController';

const PLUGIN_NAME = 'Discord Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    if (!config.token) {
        Logger.error(`Missing config.token for Discord Bot.`);
        return;
    }

    LoginController.addTryLoginInjectionCallback(handleWhitelist);

    if (config?.whitelist?.enabled) {
        DiscordController.populateEndpoints();
    }

    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});

function handleWhitelist(player: alt.Player, _account: Partial<Account>) {
    if (!OptionsController.isWhitelisted(player.discord.id)) {
        return `You are not currently whitelisted.`;
    }

    return false;
}
