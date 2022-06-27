import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = 'Athena Barbershops';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});
