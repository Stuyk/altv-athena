import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';
import { FuelStationSystem } from './src/core';

const PLUGIN_NAME = 'Athena Fuel Stations';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FuelStationSystem.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
