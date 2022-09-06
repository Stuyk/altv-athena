import * as alt from 'alt-server';
import { AgendaSystem } from '../../../server/systems/agenda';
import { PluginSystem } from '../../../server/systems/plugins';
import { ATHENA_EXAMPLE_AGENDA } from '../shared/enums';

const PLUGIN_NAME = 'Agenda - Athena Logo Example';

/**
 * `Show the Athena logo and then wait 2 seconds before continuing`
 * @param {alt.Player} player - alt.Player - The player who is going to be shown the agenda.
 * @returns The function itself.
 */
function showAthenaLogo(player: alt.Player) {
    alt.emitClient(player, ATHENA_EXAMPLE_AGENDA.SHOW);
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        alt.emitClient(player, ATHENA_EXAMPLE_AGENDA.CLOSE);
        alt.nextTick(() => {
            AgendaSystem.goNext(player);
        });
    }, 2000);
}

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
    AgendaSystem.set(0, showAthenaLogo);
});
