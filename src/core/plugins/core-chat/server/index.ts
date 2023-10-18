import * as Athena from '@AthenaServer/api/index.js';
import { init } from './src/chat.js';
import './src/commands.js';

const PLUGIN_NAME = 'chat';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    init();
});
