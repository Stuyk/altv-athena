import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { Nametags } from './src/nametags';

const PLUGIN_NAME = 'Nametags Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    Nametags.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
