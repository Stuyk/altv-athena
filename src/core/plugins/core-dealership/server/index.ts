import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { DealershipView } from './src/view';

const PLUGIN_NAME = 'Athena Dealership';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    DealershipView.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
