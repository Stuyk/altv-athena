import alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { ExampleWebViewServer } from './src/view';

const PLUGIN_NAME = 'Example WebView Plugin';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    ExampleWebViewServer.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});
