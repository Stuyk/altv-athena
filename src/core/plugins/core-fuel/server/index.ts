import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FuelSystem } from './src/fuel';

const PLUGIN_NAME = 'Athena Fuel';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FuelSystem.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
