import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { DebugKeys } from './system/keys';
import { RestService } from './system/rest';

const PLUGIN_NAME = 'athena-debug';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    if (!alt.debug) {
        return;
    }

    RestService.init();
    DebugKeys.init();
});
