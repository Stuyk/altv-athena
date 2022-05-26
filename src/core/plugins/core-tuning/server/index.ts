import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { VehicleHandler } from './VehicleHandler';

const PLUGIN_NAME = 'Tuning Plugin';

import './TestCommands';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    VehicleHandler.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
