import * as alt from 'alt-server';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { DebugKeys } from './system/keys';
import { RestService } from './system/rest';

const PLUGIN_NAME = 'Athena Debug';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    if (!alt.debug) {
        alt.log(`~lr~CORE ==> ${PLUGIN_NAME} can only be loaded in debug mode.`);
        return;
    }

    RestService.init();
    DebugKeys.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
