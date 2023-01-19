import * as alt from 'alt-server';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { ConsoleCommander } from '@AthenaShared/utility/consoleCommander';

import './commands/moderator';
import './commands/player';

const PLUGIN_NAME = 'commands';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ConsoleCommander.init(alt);
});
