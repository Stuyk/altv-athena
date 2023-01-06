import * as alt from 'alt-server';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { init } from './src/chat';

const PLUGIN_NAME = 'Chat';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    init();
    alt.log(`~lg~${PLUGIN_NAME}`);
});
