import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { DebugKeys } from './system/keys.js';
import { RestService } from './system/rest.js';

const PLUGIN_NAME = 'athena-debug';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    if (!alt.debug) {
        return;
    }

    RestService.init();
    DebugKeys.init();
});
