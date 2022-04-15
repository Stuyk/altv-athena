import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ConsoleCommander } from '../shared/consoleCommander';
import { ConsoleCommands } from './src/commands';

const PLUGIN_NAME = 'Console Commands';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await ConsoleCommander.init(alt);
    await ConsoleCommands.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
