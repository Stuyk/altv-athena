import * as alt from 'alt-server';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';
import { decryptData, encryptData, getPublicKey, sha256Random } from '../utility/encryption';

dotenv.config();

// These settings are very sensitive.
// If you are not sure what they do; do not change them.
// These connect to a backend that helps users login with Discord oAuth2.
const azureURL = process.env.ENDPOINT ? process.env.ENDPOINT : `https://ares.stuyk.com`;
const azureRedirect = encodeURI(`${azureURL}/v1/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=759238336672956426&redirect_uri=${azureRedirect}&prompt=none&response_type=code&scope=identify`;

alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);

/**
 * How does this work?
 * There is an azure web app that this module connects to.
 * It has a public key that is accessible by anyone.
 * That url is: https://altv-athena-discord.azurewebsites.net/v1/request/key
 * The module fetches the public key from the azure web app.
 * This module then uses that public key to generate a shared secret through a Diffie Helman Exchange with our private and their public.
 * Once the secret is generated we can encrypt data to send to the web app.
 * We send our module's generated public key and player information to the azure web app.
 * The player is then tasked to open an external url for a Discord oAuth2 Login.
 * The azure web app will automatically re-direct the page if the authorization is successful.
 * Then port the information through an event inside of this module.
 * The information ported through the express server is encrypted which helps us verify it's a real request.
 */
async function handlePlayerConnect(player) {
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
    const public_key = await getPublicKey();
    const encryptedData = await encryptData(JSON.stringify(encryptionFormatObject));
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

    const result = await axios.get(`${azureURL}/v1/get/key`).catch(() => {
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

export function getAzureURL() {
    return azureURL;
}

async function handleFinishAuth(player) {
    const player_identifier = player.discordToken;
    if (!player_identifier) {
        return;
    }

    const public_key = await getPublicKey();
    const azureURL = await getAzureURL();

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

    const data = await decryptData(JSON.stringify(result.data)).catch((err) => {
        alt.emitClient(player, 'Discord:Fail', 'Could not decrypt data from Authorization service.');
        return null;
    });

    if (!data) {
        return;
    }

    alt.emitClient(player, `Discord:Close`);
    alt.emit('Discord:Login', player, JSON.parse(data));
}
