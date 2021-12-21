import * as alt from 'alt-server';
import axios, { AxiosRequestConfig } from 'axios';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { IConfig } from '../interface/IConfig';
import { LoginController } from '../systems/login';
import Ares from '../utility/ares';
import { sha256Random } from '../utility/encryption';
import ConfigUtil from '../utility/config';

// These settings are very sensitive.
// If you are not sure what they do; do not change them.
// These connect to a backend that helps users login with Discord oAuth2.

const config = ConfigUtil.get();
const aresURL = config.ARES_ENDPOINT ? config.ARES_ENDPOINT : `https://ares.stuyk.com`;
const aresRedirect = encodeURI(`${aresURL}/v1/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=759238336672956426&redirect_uri=${aresRedirect}&prompt=none&response_type=code&scope=identify%20email`;

// This is called from the connectionComplete event on client-side.
alt.onClient(SYSTEM_EVENTS.BEGIN_CONNECTION, handlePlayerConnect);
alt.onClient(SYSTEM_EVENTS.DISCORD_FINISH_AUTH, handleFinishAuth);

async function handlePlayerConnect(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    // Used to identify the player when the information is sent back.
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    player.discordToken = sha256Random(uniquePlayerData);

    // Used as the main data format for talking to the Azure Web App.
    const encryptionFormatObject = {
        player_identifier: player.discordToken,
        redirect_url: null,
    };

    // Used to add a custom redirect endpoint after successful authentication.
    if (DEFAULT_CONFIG.LOGIN_REDIRECT_URL) {
        encryptionFormatObject.redirect_url = DEFAULT_CONFIG.LOGIN_REDIRECT_URL;
    }

    // Setup Parseable Format for Azure
    const public_key = await Ares.getPublicKey();
    const encryptedData = await Ares.encrypt(JSON.stringify(encryptionFormatObject));
    const senderFormat = {
        public_key,
        data: encryptedData,
    };

    const encryptedDataJSON = JSON.stringify(senderFormat);
    const discordOAuth2URL = getDiscordOAuth2URL();

    playerFuncs.set.firstConnect(player);
    alt.emitClient(player, SYSTEM_EVENTS.DISCORD_OPEN, `${discordOAuth2URL}&state=${encryptedDataJSON}`);
}

/**
 * Returns the Azure Public Key from the Azure Web App.
 * @export
 * @return {string}
 */
export async function fetchAzureKey() {
    let azurePubKey;

    const result = await axios.get(`${aresURL}/v1/get/key`).catch(() => {
        return null;
    });

    if (!result || !result.data || !result.data.status) {
        return await fetchAzureKey();
    }

    azurePubKey = result.data.key;
    return azurePubKey;
}

/**
 * Gets the Discord oAuth2 URL.
 * @export
 * @return {string}
 */
export function getDiscordOAuth2URL() {
    return url;
}

export function getAresURL() {
    return aresURL;
}

async function handleFinishAuth(player: alt.Player) {
    const player_identifier = player.discordToken;
    if (!player_identifier) {
        return;
    }

    const public_key = await Ares.getPublicKey();
    const azureURL = await getAresURL();

    const options: AxiosRequestConfig = {
        method: 'POST',
        url: `${azureURL}/v1/post/discord`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            data: {
                player_identifier,
                public_key,
            },
        },
    };

    const result = await axios.request(options).catch((err) => {
        alt.emitClient(player, 'Discord:Fail', 'Could not communicate with Authorization service.');
        return null;
    });

    if (!result) {
        return;
    }

    const data = await Ares.decrypt(JSON.stringify(result.data)).catch((err) => {
        alt.emitClient(player, 'Discord:Fail', 'Could not decrypt data from Authorization service.');
        return null;
    });

    if (!data) {
        return;
    }

    alt.emitClient(player, `Discord:Close`);
    LoginController.tryLogin(player, JSON.parse(data));
}
