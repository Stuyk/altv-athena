import * as alt from 'alt-server';
import { PluginSystem } from '@AthenaServer/systems/plugins';

const PLUGIN_NAME = 'Chat';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
