import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';
import { RoleplayCommands } from './src/commands';

const PLUGIN_NAME = 'Athena Roleplay Commands';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    RoleplayCommands.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
