import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './commands/chat';
import './commands/currency';
import './commands/interior';
import './commands/player';
import './commands/teleport';
import './commands/vehicle';

const MODCOMMANDS = 'Moderation Commands';

PluginSystem.registerPlugin(MODCOMMANDS, () => {
    alt.log(`~lg~${MODCOMMANDS} was Loaded!`);
});
