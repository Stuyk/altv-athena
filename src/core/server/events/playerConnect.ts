import * as alt from 'alt-server';
import { sha256Random } from '../utility/encryption';
import { DISCORD_CONFIG } from '../athena/configDiscord';
import { Player } from 'alt-server';
import { View_Events_Discord } from '../../shared/enums/views';
import { DEFAULT_CONFIG } from '../athena/main';

const redirect = encodeURI(`http://${DISCORD_CONFIG.DISCORD_REDIRECT_IP}:7790/authenticate`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CONFIG.DISCORD_CLIENT_ID}&redirect_uri=${redirect}&prompt=none&response_type=code&scope=identify`;

alt.on('playerConnect', handlePlayerConnect);

/**
 * Called when a player connects to the server.
 * @param  {Player} player
 */
function handlePlayerConnect(player: Player) {
    alt.log(`(${player.id}) ${player.name} has connected to the server.`);

    player.dimension = player.id;
    player.pendingLogin = true;
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    player.init();
    player.safeSetPosition(pos.x, pos.y, pos.z);
    player.emit(View_Events_Discord.Auth, `${url}&state=${player.discordToken}`);
}
