import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';
import './src/registerCmds';

const MODCOMMANDS = 'Moderation Commands';
PluginSystem.registerPlugin(MODCOMMANDS, () => {
    alt.log(`~lg~${MODCOMMANDS} was Loaded!`);
});
