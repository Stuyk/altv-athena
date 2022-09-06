import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { LoginController } from './src/login';
import { LoginView } from './src/view';

const PLUGIN_NAME = 'Athena Discord Login';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    LoginView.init();
    LoginController.init();

    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
