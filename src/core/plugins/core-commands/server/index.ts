import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

// Add Command Imports here.
import './commands/moderator/currency';
import './commands/moderator/garage';
import './commands/moderator/interior';
import './commands/moderator/inventory';
import './commands/moderator/noclip';
import './commands/moderator/player';
import './commands/moderator/teleport';
import './commands/moderator/test';
import './commands/moderator/vehicle';
import './commands/moderator/wanted';
import './commands/moderator/weapon';
import './commands/moderator/chat';

import './commands/player/chat';
import './commands/player/death';
import './commands/player/job';
import './commands/player/seatbelt';
import './commands/player/vehicle';

const PLUGIN_NAME = 'Athena Roleplay Commands';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
