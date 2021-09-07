import * as alt from 'alt-server';
import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IConfig } from '../interface/IConfig';
import Ares from '../utility/ares';
import { sha256Random } from '../utility/encryption';

const TIMES_TO_CHECK_CONNECTION = 25;
const config: IConfig = dotenv.config().parsed as IConfig;
const connectingUsers: { [key: string]: number } = {};

// These settings are very sensitive.
// If you are not sure what they do; do not change them.
// These connect to a backend that helps users login with Discord oAuth2.
const aresURL = config.ARES_ENDPOINT ? config.ARES_ENDPOINT : `https://ares.stuyk.com`;
const aresRedirect = encodeURI(`${aresURL}/v1/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=759238336672956426&redirect_uri=${aresRedirect}&prompt=none&response_type=code&scope=identify%20email`;

alt.onClient('discord:FinishAuth', handleFinishAuth);
alt.onClient(SYSTEM_EVENTS.CHECK_CONNECTION, checkConnection);

/**
 * Called by the client multiple times to verify data is coming through.
 * Also returns a response to get the next check.
 * @param {alt.Player} player
 * @return {*}
 */
function checkConnection(player: alt.Player) {
    if (connectingUsers[player.ip] >= TIMES_TO_CHECK_CONNECTION) {
        delete connectingUsers[player.ip];
        handlePlayerConnect(player);
        return;
    }

    if (!connectingUsers[player.ip]) {
        connectingUsers[player.ip] = 1;
    } else {
        connectingUsers[player.ip] += 1;
    }

    alt.emitClient(player, SYSTEM_EVENTS.CHECK_CONNECTION, [connectingUsers[player.ip], TIMES_TO_CHECK_CONNECTION]);
}

async function handlePlayerConnect(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    // Used to identify the player when the information is sent back.
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    player.discordToken = sha256Random(uniquePlayerData);

    // Used as the main data format for talking to the Azure Web App.
    const encryptionFormatObject = {
        player_identifier: player.discordToken
    };

    // Setup Parseable Format for Azure
    const public_key = await Ares.getPublicKey();
    const encryptedData = await Ares.encrypt(JSON.stringify(encryptionFormatObject));
    const senderFormat = {
        public_key,
        data: encryptedData
    };

    const encryptedDataJSON = JSON.stringify(senderFormat);
    const discordOAuth2URL = getDiscordOAuth2URL();

    alt.emit(`Discord:Opened`, player);
    alt.emitClient(player, 'Discord:Open', `${discordOAuth2URL}&state=${encryptedDataJSON}`);
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

async function handleFinishAuth(player) {
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
                public_key
            }
        }
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
    alt.emit('Discord:Login', player, JSON.parse(data));
}
