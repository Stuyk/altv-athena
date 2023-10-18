import * as Athena from '@AthenaServer/api/index.js';
import { CharacterCreatorView } from './src/view.js';

const PLUGIN_NAME = 'character-creator';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    CharacterCreatorView.init();
});
