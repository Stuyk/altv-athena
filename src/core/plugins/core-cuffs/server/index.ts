import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CuffSystem } from './src/system';

const PLUGIN_NAME = 'Athena Cuffs';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await CuffSystem.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
