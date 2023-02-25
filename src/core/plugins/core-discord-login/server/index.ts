import * as Athena from '@AthenaServer/api';
import { LoginController } from './src/login';
import { LoginView } from './src/view';

const PLUGIN_NAME = 'discord-login';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    LoginView.init();
    LoginController.init();
});
