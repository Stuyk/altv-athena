import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';
import { FactionSystem } from './src/system';

const PLUGIN_NAME = 'Athena Factions';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await FactionSystem.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
