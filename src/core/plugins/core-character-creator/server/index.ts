import { PluginSystem } from '@AthenaServer/systems/plugins';
import { CharacterCreatorView } from './src/view';

const PLUGIN_NAME = 'character-creator';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterCreatorView.init();
});
