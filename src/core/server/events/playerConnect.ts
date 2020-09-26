import * as alt from 'alt-server';
import { IDiscord } from '../interface/IDiscord';
import { IPlayer } from '../interface/IPlayer';
import { sha256Random } from '../utility/encryption';
import { DISCORD_CONFIG } from '../athena/configDiscord';

const redirect = encodeURI(`http://${DISCORD_CONFIG.DISCORD_REDIRECT_IP}:7790/authenticate`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CONFIG.DISCORD_CLIENT_ID}&redirect_uri=${redirect}&prompt=none&response_type=code&scope=identify`;

alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: IPlayer) {
    alt.log(`${player.name} has connected to the server.`);

    player.pendingLogin = true;
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));
    alt.emitClient(player, 'discord:Auth', `${url}&state=${player.discordToken}`);
}
