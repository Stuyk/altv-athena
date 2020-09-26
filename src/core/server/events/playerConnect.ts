import * as alt from 'alt-server';
import { IDiscord } from '../interface/IDiscord';
import { IPlayer } from '../interface/IPlayer';
import { sha256Random } from '../utility/encryption';

const config: IDiscord = process.env as IDiscord;
const redirect = encodeURI(`http://${config.REDIRECT_IP}:7790/authenticate`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env['CLIENT_ID']}&redirect_uri=${redirect}&prompt=none&response_type=code&scope=identify`;

alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: IPlayer) {
    player.pendingLogin = true;
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));
    alt.emitClient(player, 'discord:Auth', `${url}&state=${player.discordToken}`);
}
