import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import axios, { AxiosRequestConfig } from 'axios';
import { DISCORD_LOGIN_EVENTS } from '../../shared/events';
import { LoginController } from './login';
import { DISCORD_LOCALES } from '../../shared/locales';
import { Account } from '@AthenaServer/interface/iAccount';
import { DiscordUser } from '@AthenaServer/interface/iDiscordUser';
import { OAUTH_CONFIG } from '@AthenaPlugins/core-discord-login/shared/config';
import Database from '@stuyk/ezmongodb';

const url = `https://discord.com/api/oauth2/authorize?client_id=${OAUTH_CONFIG.DISCORD.CLIENT_ID}&redirect_uri=${OAUTH_CONFIG.URL}/auth&prompt=none&response_type=code&scope=identify%20email`;
const UniquePlayerIdentifiers: { [player_id: string]: string } = {};

async function tryToFinishLogin(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    const pid = UniquePlayerIdentifiers[player.id];
    if (typeof pid === 'undefined') {
        return;
    }

    const options: AxiosRequestConfig = {
        method: 'GET',
        url: `${OAUTH_CONFIG.URL}/user/${pid}`,
        headers: { 'Content-Type': 'application/json' },
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
        Athena.webview.emit(
            player,
            DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE,
            DISCORD_LOCALES.NO_MATCHING_UID_FOUND,
        );
        return;
    }

    if (!Object.hasOwn(result, 'data')) {
        Athena.webview.emit(
            player,
            DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_ERROR_MESSAGE,
            DISCORD_LOCALES.NO_MATCHING_UID_FOUND,
        );
        return;
    }

    alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE);

    if (typeof result.data === 'string') {
        player.discord = JSON.parse(result.data) as DiscordUser;
    } else {
        player.discord = result.data as DiscordUser;
    }

    delete UniquePlayerIdentifiers[player.id];
    LoginController.tryLogin(player);
}

export class LoginView {
    /**
     * Initializes callbacks.
     *
     * @static
     * @memberof LoginView
     */
    static init() {
        alt.on('playerDisconnect', LoginView.handleDisconnect);
        alt.onClient(DISCORD_LOGIN_EVENTS.TO_SERVER.TRY_FINISH, tryToFinishLogin);
        Athena.systems.loginFlow.add('authentication', 1, LoginView.prepare);
    }

    /**
     * Opens the WebView, and passes a Discord URL for the user to open.
     *
     * @static
     * @param {alt.Player} player
     * @memberof LoginView
     */
    static async show(player: alt.Player) {
        const pid = Athena.utility.hash.sha256Random(JSON.stringify(player.ip + player.hwidHash + player.hwidExHash));
        UniquePlayerIdentifiers[player.id] = pid;
        alt.emitClient(player, DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN, `${url}&state=${pid}`);
    }

    /**
     * Show the Login Screen to the Client
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof LoginFunctions
     */
    static async prepare(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        // Perform JWT Quick Login Lookup First
        const token = await Athena.systems.jwt.fetch(player);
        if (typeof token === 'undefined') {
            LoginView.show(player);
            return;
        }

        const identifier = await Athena.systems.jwt.verify(token);
        if (typeof identifier === 'undefined') {
            LoginView.show(player);
            return;
        }

        const account: Partial<Account> | null = await Database.fetchData<Account>(
            '_id',
            identifier,
            Athena.database.collections.Accounts,
        );

        if (typeof account === 'undefined' || !account) {
            LoginView.show(player);
            return;
        }

        player.discord = {
            id: account.discord,
        } as DiscordUser;

        LoginController.tryLogin(player);
    }

    static handleDisconnect(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        const id = player.id;

        if (typeof id === 'undefined') {
            return;
        }

        delete UniquePlayerIdentifiers[player.id];
    }
}
