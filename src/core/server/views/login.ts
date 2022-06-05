import * as alt from 'alt-server';
import axios, { AxiosRequestConfig } from 'axios';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';
import Ares from '../utility/ares';
import { sha256Random } from '../utility/encryption';
import ConfigUtil from '../utility/config';
import { AgendaSystem } from '../systems/agenda';
import { playerConst } from '../api/consts/constPlayer';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

// These settings are very sensitive.
// If you are not sure what they do; do not change them.
// These connect to a backend that helps users login with Discord oAuth2.

const config = ConfigUtil.get();
const aresURL = config.ARES_ENDPOINT ? config.ARES_ENDPOINT : `https://ares.stuyk.com`;
const aresRedirect = encodeURI(`${aresURL}/v1/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=759238336672956426&redirect_uri=${aresRedirect}&prompt=none&response_type=code&scope=identify%20email`;

/**
 * Gets the Discord oAuth2 URL.
 * @export
 * @return {string}
 */
function getDiscordOAuth2URL() {
    return url;
}

/**
 * Return a static URL for POST requests.
 * @return {*}
 */
function getAresURL() {
    return aresURL;
}

/**
 * Fetches data from the Ares Backend for Login Caching
 * @param {alt.Player} player
 * @return {*}
 */
async function finishLogin(player: alt.Player) {
    const player_identifier = player.discordToken;
    if (!player_identifier) {
        return;
    }

    const public_key = await Ares.getPublicKey();
    const aresURL = await getAresURL();

    const options: AxiosRequestConfig = {
        method: 'POST',
        url: `${aresURL}/v1/post/discord`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            data: {
                player_identifier,
                public_key,
            },
        },
    };

    const result = await axios.request(options).catch((err) => {
        alt.emitClient(
            player,
            'Discord:Fail',
            LocaleController.get(LOCALE_KEYS.DISCORD_COULD_NOT_COMMUNICATE_WITH_AUTH_SERVICE),
        );
        return null;
    });

    if (!result) {
        return;
    }

    const data = await Ares.decrypt(JSON.stringify(result.data)).catch((err) => {
        alt.emitClient(
            player,
            'Discord:Fail',
            LocaleController.get(LOCALE_KEYS.DISCORD_COULD_NOT_DECRYPT_DATA_FROM_AUTH_SERVICE),
        );
        return null;
    });

    if (!data) {
        return;
    }

    alt.emitClient(player, SYSTEM_EVENTS.DISCORD_CLOSE);
    if (typeof data === 'string') {
        player.discord = JSON.parse(data);
    } else {
        player.discord = data;
    }

    AgendaSystem.goNext(player, false);
}

export class LoginView {
    static init() {
        alt.onClient(SYSTEM_EVENTS.DISCORD_FINISH_AUTH, finishLogin);
    }

    /**
     * Show the Login Screen to the Client
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof LoginFunctions
     */
    static async show(player: alt.Player) {
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

        playerConst.set.firstConnect(player);
        alt.emitClient(player, SYSTEM_EVENTS.DISCORD_OPEN, `${discordOAuth2URL}&state=${encryptedDataJSON}`);
    }
}

/**
 * @deprecated Use {@link LoginView}
 */
export const LoginFunctions = LoginView;

LoginView.init();
