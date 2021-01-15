import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import './playerDeath';

alt.on('Discord:Opened', handlePlayerConnect);

/**
 * Called when a player connects to the server.
 * @param  {alt.Player} player
 */
async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) {
        return;
    }

    alt.log(`(${player.id}) ${player.name} has connected to the server.`);
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        player.set().firstConnect();
    }, 1000);
}

alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
