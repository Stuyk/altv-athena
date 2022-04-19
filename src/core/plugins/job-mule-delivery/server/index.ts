import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { MuleJob } from './src/job';

const PLUGIN_NAME = 'Mule Job';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
    MuleJob.init();
});
