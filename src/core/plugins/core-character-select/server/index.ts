import * as Athena from '@AthenaServer/api';
import { CharacterSelectView } from './src/view';

const PLUGIN_NAME = 'character-select';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    CharacterSelectView.init();
});
