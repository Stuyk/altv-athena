import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ConsoleCommander } from '../../../shared/utility/consoleCommander';
import { ConsoleCommands } from './commands/consoleCommands';

import './commands/moderator';
import './commands/player';

const PLUGIN_NAME = 'Athena Roleplay Commands';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ConsoleCommander.init(alt);
    ConsoleCommands.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
