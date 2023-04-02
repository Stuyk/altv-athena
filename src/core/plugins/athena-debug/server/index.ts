import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { DebugKeys } from './system/keys';
import { RestService } from './system/rest';
import { ATHENA_DEBUG_EVENTS } from '../shared/events';

const PLUGIN_NAME = 'athena-debug';

function handleExec(player: alt.Player, type: string, code: string) {
    if (type === 'server') {
        eval(code);
        return;
    }

    player.emit(ATHENA_DEBUG_EVENTS.toClient.exec, code);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    if (!alt.debug) {
        return;
    }

    RestService.init();
    DebugKeys.init();

    const restrictedFunction = Athena.utility.restrict.create(handleExec, {
        permissions: { account: ['admin'], character: [] },
        strategy: 'hasOne',
        notify: 'No permission to perform code execution.',
    });

    alt.onClient(ATHENA_DEBUG_EVENTS.toServer.exec, restrictedFunction);

    Athena.systems.messenger.commands.register('editor', '/editor', ['admin'], (player: alt.Player) => {
        player.emit(ATHENA_DEBUG_EVENTS.toClient.openExec);
    });
});
