import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { CharacterCreatorView } from './src/view';

const PLUGIN_NAME = 'Athena Character Creator';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    CharacterCreatorView.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
