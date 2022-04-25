import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/commands/weatherCommands';

const PLUGIN_NAME = 'Athena Weather';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});