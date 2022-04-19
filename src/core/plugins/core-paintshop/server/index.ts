import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { PaintShopView } from './src/view';

const PLUGIN_NAME = 'Paint Shop Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    PaintShopView.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
