import * as alt from 'alt-server';
import axios, { AxiosRequestConfig } from 'axios';

import { DEFAULT_CONFIG } from '../../../../server/athena/main';
import Ares from '../../../../server/utility/ares';
import { sha256Random } from '../../../../server/utility/encryption';
import ConfigUtil from '../../../../server/utility/config';
import { AgendaSystem } from '../../../../server/systems/agenda';
import { AgendaOrder } from '../../../../server/systems/agenda';
import { DISCORD_LOGIN_EVENTS } from '../../shared/events';
import { Athena } from '../../../../server/api/athena';
import { LoginController } from './login';
import { DISCORD_LOCALES } from '../../shared/locales';
import { JwtProvider } from '../../../../server/systems/jwt';
import { Account } from '../../../../server/interface/iAccount';
import { DiscordUser } from '../../../../server/interface/iDiscordUser';

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
 * Performs a POST request to the 'Ares' backend.
 * Tries to look up server information, and find a matching oAuth2 authorization.
 *
 * Ares is hosted by Stuyk.
 *
 * @param {alt.Player} player
 * @return {*}
 */
async function tryToFinishLogin(player: alt.Player) {
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
        Athena.webview.emit(
            player,
            DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE,
            DISCORD_LOCALES.DISCORD_COULD_NOT_COMMUNICATE_WITH_AUTH_SERVICE,
        );

        return null;
    });

    if (!result) {
        return;
    }

    const data = await Ares.decrypt(JSON.stringify(result.data)).catch((err) => {
        Athena.webview.emit(
            player,
            DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE,
            DISCORD_LOCALES.DISCORD_COULD_NOT_DECRYPT_DATA_FROM_AUTH_SERVICE,
        );
        return null;
    });

    if (!data) {
        return;
    }

    alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE);
    if (typeof data === 'string') {
        player.discord = JSON.parse(data);
    } else {
        player.discord = data;
    }

    LoginController.tryLogin(player);
}

export class LoginView {
    static init() {
        alt.onClient(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_FINISH, tryToFinishLogin);
        AgendaSystem.set(AgendaOrder.LOGIN_SYSTEM, LoginView.show);
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

        // Perform JWT Fetch First
        // Ew, 3 nested if statements.
        const token = await JwtProvider.fetch(player);
        if (typeof token === 'string') {
            const identifier = await JwtProvider.verify(token);
            if (typeof identifier === 'string') {
                const account: Partial<Account> | null = await Athena.database.funcs.fetchData<Account>(
                    '_id',
                    identifier,
                    Athena.database.collections.Accounts,
                );

                if (account) {
                    player.discord = {
                        id: account.discord,
                    } as DiscordUser;

                    LoginController.tryLogin(player);
                    return;
                }
            }
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

        alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN, `${discordOAuth2URL}&state=${encryptedDataJSON}`);
    }
}
