import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { FactionPaycheckSystem } from './src/system';

const PLUGIN_NAME = 'Athena Factions - Paychecks';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    FactionPaycheckSystem.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
