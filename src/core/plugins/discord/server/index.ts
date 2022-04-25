import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { DISCORD_CONFIG } from './config';
import { DiscordCommands } from './src/commands';
import { DiscordController } from './src/discordController';

const PLUGIN_NAME = 'Discord Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    if (!DISCORD_CONFIG.TOKEN) {
        alt.log(`~lr~[${PLUGIN_NAME}] No 'TOKEN' was provided please add bot token to config.`);
        alt.log(`~lr~Visit: https://discord.com/developers/applications`);
        return;
    }

    if (!DISCORD_CONFIG.SERVER_ID) {
        alt.log(`~lr~[${PLUGIN_NAME}] No discord 'SERVER_ID' was provided please add server id to config.`);
        return;
    }

    DiscordController.init(DISCORD_CONFIG.TOKEN, DISCORD_CONFIG.SERVER_ID);

    if (DISCORD_CONFIG.ALLOW_LIST && DISCORD_CONFIG.ALLOW_LIST.ENABLED) {
        await DiscordController.isReady();
        await DiscordController.initAllowList(DISCORD_CONFIG.ALLOW_LIST.ROLE);
        await DiscordCommands.init();
    }

    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
