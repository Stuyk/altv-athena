import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { VehicleRepoJob } from './src/job';

const PLUGIN_NAME = 'Vehicle Repo Job';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
    VehicleRepoJob.init();
});
