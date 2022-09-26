import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = 'Athena Fingerpoint';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});