import * as Athena from '@AthenaServer/api';
import { init } from './src/chat';
import './src/commands';

const PLUGIN_NAME = 'chat';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    init();
});
