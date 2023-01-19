import { PluginSystem } from '@AthenaServer/systems/plugins';
import { LoginController } from './src/login';
import { LoginView } from './src/view';

const PLUGIN_NAME = 'discord-login';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    LoginView.init();
    LoginController.init();
});
