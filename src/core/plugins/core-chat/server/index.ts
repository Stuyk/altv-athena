import { PluginSystem } from '@AthenaServer/systems/plugins';
import { init } from './src/chat';
import './src/commands';

const PLUGIN_NAME = 'chat';
PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    init();
});
