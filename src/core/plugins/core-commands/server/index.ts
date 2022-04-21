import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

// TODO: Add Imports here.
import './commands/moderator/currency';
import './commands/moderator/garage';
import './commands/moderator/interior';
import './commands/moderator/inventory';
import './commands/moderator/item';
import './commands/moderator/noclip';
import './commands/moderator/player';
import './commands/moderator/revive';
import './commands/moderator/teleport';
import './commands/moderator/test';
import './commands/moderator/vehicle';
import './commands/moderator/wanted';
import './commands/moderator/weapon';

import './commands/player/chat';
import './commands/player/death';
import './commands/player/do';
import './commands/player/job';
import './commands/player/low';
import './commands/player/me';
import './commands/player/ooc';
import './commands/player/seatbelt';
import './commands/player/vehicle';
import './commands/player/whisper';

const PLUGIN_NAME = 'Athena Roleplay Commands';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
