import { PluginSystem } from '@AthenaServer/systems/plugins';
import { CharacterSelectView } from './src/view';

const PLUGIN_NAME = 'character-select';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterSelectView.init();
});
