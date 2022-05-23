import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { createDefaultInteriors } from './src/interiors';
import { InteriorSystem } from './src/system';

const PLUGIN_NAME = 'Athena Interiors';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await InteriorSystem.init();
    await createDefaultInteriors();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
