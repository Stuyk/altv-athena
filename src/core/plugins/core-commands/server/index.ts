import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './commands/moderator';
import './commands/player';

const PLUGIN_NAME = 'Athena Roleplay Commands';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
