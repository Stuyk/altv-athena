import * as alt from 'alt-server';
import axios from 'axios';
import { encryptData, getPublicKey, setAzurePublicKey, sha256Random } from '../utility/encryption';
import { DISCORD_CONFIG } from '../athena/configDiscord';
import { Player } from 'alt-server';
import { View_Events_Discord } from '../../shared/enums/views';
import { DEFAULT_CONFIG } from '../athena/main';

const azureURL = `https://altv-athena-discord.azurewebsites.net`;
const azureRedirect = encodeURI(`${azureURL}/v1/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=759238336672956426&redirect_uri=${azureRedirect}&prompt=none&response_type=code&scope=identify`;

alt.on('playerConnect', handlePlayerConnect);

/**
 * Called when a player connects to the server.
 * @param  {Player} player
 */
async function handlePlayerConnect(player: Player) {
    alt.log(`(${player.id}) ${player.name} has connected to the server.`);

    player.dimension = player.id;
    player.pendingLogin = true;
    player.discordToken = sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    // Request Public Key from Azure
    for(let i = 0; i < 100; i++) {
        const result = await axios.get(`${azureURL}/v1/get/key`, {});
        if (!result || !result.data || !result.data.status) {
            continue;
        }

        setAzurePublicKey(result.data.key);
        break;
    }

    // Setup Data for Azure Authentication
    const encryptionFormat = {
        sub_key: 'abc123',
        player_identifier: player.discordToken,
        server_ip: DISCORD_CONFIG.DISCORD_REDIRECT_IP,
        server_port: 7790
    }

    // Setup Parseable Format for Azure
    const senderFormat = {
        public_key: getPublicKey(),
        data: encryptData(JSON.stringify(encryptionFormat))
    }

    const encryptedDataJSON = JSON.stringify(senderFormat);

    player.init();
    player.safeSetPosition(pos.x, pos.y, pos.z);
    player.emit(View_Events_Discord.Auth, `${url}&state=${encryptedDataJSON}`);
}

