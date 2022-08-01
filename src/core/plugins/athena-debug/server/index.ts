import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { Keys } from './system/keys';
import { WebSocketClient } from './system/ws';

const PLUGIN_NAME = 'Athena Debug';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    WebSocketClient.init();
    Keys.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
