import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';

const PLUGIN_NAME = 'Example Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
