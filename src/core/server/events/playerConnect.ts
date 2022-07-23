import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { AgendaSystem } from '../systems/agenda';
import { DevModeOverride } from '../systems/dev';
import ConfigUtil from '../utility/config';

/**
 * Called when a player connects to the server.
 * This is a client-side invoke to ensure they're fully loaded before starting.
 * @param  {alt.Player} player
 */
async function handlePlayerConnect(player: alt.Player): Promise<void> {
    const config = ConfigUtil.get();

    // ! - Allows Dev Mode to Use First Account or Accounts
    if (typeof config !== 'undefined' && config.USE_DEV_MODE) {
        alt.logWarning(`Using DEV_MODE. Only one account will be used.`);
        DevModeOverride.login(player);
        return;
    }

    // What is this? It's a series of steps the client follows for a login sequence.
    AgendaSystem.goNext(player, true);
}

alt.onClient(SYSTEM_EVENTS.BEGIN_CONNECTION, handlePlayerConnect);
