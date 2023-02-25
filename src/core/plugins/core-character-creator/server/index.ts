import * as Athena from '@AthenaServer/api';
import { CharacterCreatorView } from './src/view';

const PLUGIN_NAME = 'character-creator';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    CharacterCreatorView.init();
});
