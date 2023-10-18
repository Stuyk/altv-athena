import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { ConsoleCommander } from '@AthenaShared/utility/consoleCommander.js';

import './commands/moderator/index.js';
import './commands/player/index.js';
import './commands/admin/index.js';

const PLUGIN_NAME = 'commands';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    ConsoleCommander.init(alt);
});
