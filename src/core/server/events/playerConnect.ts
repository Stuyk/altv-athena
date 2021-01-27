import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/Player';
import './playerDeath';

alt.on('Discord:Opened', handlePlayerConnect);

/**
 * Called when a player connects to the server.
 * @param  {alt.Player} player
 */
async function handlePlayerConnect(player: alt.Player): Promise<void> {
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        alt.log(`(${player.id}) ${player.name} has connected to the server.`);
        playerFuncs.set.firstConnect(player);
    }, 0);
}
