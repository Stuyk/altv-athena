import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';
import { RegisterItems } from './src/registerItems';

const PLUGIN_NAME = 'Item Defaults Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    RegisterItems.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
