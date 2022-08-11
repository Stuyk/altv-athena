import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { InventoryView } from './src/view';

const PLUGIN_NAME = 'core-inventory';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    InventoryView.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
