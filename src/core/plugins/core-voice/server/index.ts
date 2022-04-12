import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { VoiceSystem } from './src/system';

const PLUGIN_NAME = 'Voice Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    VoiceSystem.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
