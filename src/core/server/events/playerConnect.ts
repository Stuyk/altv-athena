import * as alt from 'alt-server';
import { sha256Random } from '../utility/encryption';
import { DISCORD_CONFIG } from '../athena/configDiscord';
import { Player } from 'alt-server';

const redirect = encodeURI(`http://${DISCORD_CONFIG.DISCORD_REDIRECT_IP}:7790/authenticate`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CONFIG.DISCORD_CLIENT_ID}&redirect_uri=${redirect}&prompt=none&response_type=code&scope=identify`;

alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: Player) {
    alt.log(`(${player.id}) ${player.name} has connected to the server.`);


    Object.keys(alt.Player.prototype).forEach(key => {
        console.log(key);
    });

    player.dimension = player.id;
    player.pendingLogin = true;
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));
    alt.emitClient(player, 'discord:Auth', `${url}&state=${player.discordToken}`);
}
