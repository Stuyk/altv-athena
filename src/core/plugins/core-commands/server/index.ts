import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { ConsoleCommander } from '@AthenaShared/utility/consoleCommander';

import './commands/moderator';
import './commands/player';

const PLUGIN_NAME = 'commands';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    ConsoleCommander.init(alt);
});
