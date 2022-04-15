import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ModeratorCommands } from './src/registerCmds';

const MODCOMMANDS = 'Moderation Commands';
PluginSystem.registerPlugin(MODCOMMANDS, () => {
    ModeratorCommands.init();
    alt.log(`~lg~${MODCOMMANDS} was Loaded!`);
});
