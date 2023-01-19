import * as alt from 'alt-server';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { DebugKeys } from './system/keys';
import { RestService } from './system/rest';

const PLUGIN_NAME = 'athena-debug';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    if (!alt.debug) {
        return;
    }

    RestService.init();
    DebugKeys.init();
});
