import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';
import { VitalsCommands } from './src/commands';
import { VitalsEffects } from './src/effects';
import { VitalsSystem } from './src/system';

const PLUGIN_NAME = 'Vitals Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    VitalsSystem.init();
    VitalsCommands.init();
    VitalsEffects.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
