import * as alt from 'alt-server';
import { sha256Random } from '../utility/encryption';
import { Player } from 'alt-server';
import { DEFAULT_CONFIG } from '../athena/main';

alt.on('Discord:Opened', handlePlayerConnect); // End

/**
 * Called when a player connects to the server.
 * @param  {Player} player
 */
async function handlePlayerConnect(player: Player) {
    alt.log(`(${player.id}) ${player.name} has connected to the server.`);

    if (!player) {
        return;
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    player.dimension = player.id;
    player.pendingLogin = true;
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));

    player.init();
    player.safeSetPosition(pos.x, pos.y, pos.z);

    player.emit('Login:FadeScreenOut');
}
