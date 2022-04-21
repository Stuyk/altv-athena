import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/commands/timeCommands';

const PLUGIN_NAME = 'Athena Time';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});