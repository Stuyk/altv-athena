import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';

const PLUGIN_NAME = 'Nametags Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
