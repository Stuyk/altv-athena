import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CharacterSelectView } from './src/view';

const PLUGIN_NAME = 'Athena Character Select';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterSelectView.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
