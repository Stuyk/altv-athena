import * as alt from 'alt-server';
import { sha256Random } from '../utility/encryption';
import { DEFAULT_CONFIG } from '../athena/main';
import { handleLoginRouting } from '../systems/login';
import { Events_Misc } from '../../shared/enums/events';
import { updatePlayerTime, updatePlayerWeather } from '../systems/world';
import './playerDeath';

alt.on('Discord:Opened', handlePlayerConnect);

/**
 * Called when a player connects to the server.
 * @param  {alt.Player} player
 */
async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!(player instanceof alt.Player)) {
        return;
    }

    if (!player) {
        alt.log(`Bad player reconnect. Reconnect again.`);
        return;
    }

    alt.log(`(${player.id}) ${player.name} has connected to the server.`);

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    player.dimension = player.id + 1; // First ID is 0. We add 1 so everyone gets a unique dimension.
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));
    player.pendingLogin = true;

    player.init();
    player.safeSetPosition(pos.x, pos.y, pos.z);

    updatePlayerTime(player);
    updatePlayerWeather(player);

    if (process.env.DEV_ID) {
        alt.emitClient(player, `Discord:Close`);
        handleLoginRouting(player, { id: process.env.DEV_ID });
    }
}

alt.emit(Events_Misc.EnableEntry);
