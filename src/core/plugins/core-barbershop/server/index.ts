import alt from 'alt-server';
import { ServerAPI } from '../../../server';
import { BarbershopCommands } from './src/commands';
import { BarbershopView } from './src/view';

const PLUGIN_NAME = 'Athena Barbershops';

ServerAPI.systems.PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    BarbershopView.init();
    BarbershopCommands.init();

    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});
