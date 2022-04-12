import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ClothingFunctions } from './src/view';

const PLUGIN_NAME = 'Athena Clothing';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ClothingFunctions.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
