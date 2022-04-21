import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

// TODO: Add Imports here.
import './commands/player/me';
import './commands/player/low';
import './commands/player/whisper';

const PLUGIN_NAME = 'Athena Roleplay Commands';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded!`);
});
