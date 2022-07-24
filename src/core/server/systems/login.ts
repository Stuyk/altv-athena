import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerConst } from '../api/consts/constPlayer';
import { DEFAULT_CONFIG } from '../athena/main';
import { PlayerEvents } from '../events/playerEvents';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { Account } from '../interface/iAccount';
import { Collections } from '../interface/iDatabaseCollections';
import { DiscordUser } from '../interface/iDiscordUser';
import Ares from '../utility/ares';
import { StorageView } from '../views/storage';
import { AccountSystem } from './account';
import { AgendaSystem } from './agenda';
import { Injections } from './injections';
import { LoginInjectionNames, TryLoginCallback, TryQuickTokenCallback } from './injections/login';
import { VehicleSystem } from './vehicle';

const UserRelation: { [key: number]: string } = {};
const TryLoginInjections: Array<TryLoginCallback> = [];

export class LoginController {
    /**
     * Adds a tryLogin injection callback.
     *
     * useful for adding custom logic to the login process.
     * Return a string to abort the login process and to kick the player
     *
     * @static
     * @param {TryLoginCallback} callback
     * @memberof LoginController
     */
    static addTryLoginInjection(callback: TryLoginCallback): void {
        TryLoginInjections.push(callback);
    }

    static init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, LoginController.bindPlayerToID);
        alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_NONE, LoginController.handleNoQuickToken);
        alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_EMIT, LoginController.tryDiscordQuickToken);
        alt.on('playerDisconnect', LoginController.tryDisconnect);
    }

    /**
     * Handles login from login webview.
     * Called through Agenda System.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof LoginController
     */
    static async show(player: alt.Player) {
        if (!player.discord) {
            AgendaSystem.goNext(player, true);
            return;
        }

        LoginController.tryLogin(player, null);
    }

    /**
     * Called when the player is attemping to login to their account.
     * At this stage we already have all the Discord Information or a Discord ID.
     * @static
     * @param {alt.Player} player
     * @param {Partial<DiscordUser>} data
     * @param {Partial<Account>} account
     * @return {Promise<void>}
     * @memberof LoginController
     */
    static async tryLogin(player: alt.Player, account: Partial<Account> = null): Promise<void> {
        if (!player.valid) {
            return;
        }

        delete player.pendingLogin;
        delete player.discordToken;

        const tryBeforeLoginInjections = Injections.get<TryLoginCallback>(LoginInjectionNames.TRY_LOGIN_ACCOUNT_BEGIN);
        for (const callback of tryBeforeLoginInjections) {
            const result = await callback(player, account);
            if (typeof result === 'string') {
                player.kick(result);
                return;
            }
        }

        for (const callback of TryLoginInjections) {
            const didPass = await callback(player, account);

            if (!didPass) {
                return;
            }
        }

        if (player.discord.username) {
            alt.log(`[Athena] (${player.id}) ${player.discord.username} has authenticated.`);
        }

        if (account && account.discord) {
            alt.log(`[Athena] (${player.id}) Discord ${account.discord} has logged in with a Quick Token `);
        }

        const currentPlayers = [...alt.Player.all];
        const index = currentPlayers.findIndex(
            (p) => p.discord && p.discord.id === player.discord.id && p.id !== player.id,
        );

        if (index >= 1) {
            player.kick(LocaleController.get(LOCALE_KEYS.DISCORD_ID_ALREADY_LOGGED_IN));
            return;
        }

        // Used for DiscordToken skirt.
        if (!account) {
            const accountData = await AccountSystem.getAccount(player);

            if (!accountData) {
                account = await AccountSystem.create(player);
            } else {
                account = accountData;

                // Update Email if Non-Existant
                // Update Email if Does Not Match
                if (
                    (!account.email && player.discord.email) ||
                    (player.discord.email && account.email !== player.discord.email)
                ) {
                    account.email = player.discord.email;
                    await Database.updatePartialData(
                        account._id.toString(),
                        { email: player.discord.email },
                        Collections.Accounts,
                    );
                }
            }
        }

        if (account.banned) {
            player.kick(account.reason);
            return;
        }

        const tryAfterLoginCallback = Injections.get<TryLoginCallback>(LoginInjectionNames.TRY_LOGIN_ACCOUNT_END);
        for (const callback of tryAfterLoginCallback) {
            const result = await callback(player, account);
            if (typeof result === 'string') {
                player.kick(result);
                return;
            }
        }

        await playerConst.set.account(player, account);
        AgendaSystem.goNext(player);
    }

    /**
     * When a player logs out, we want to save their data and despawn all their vehicles.
     * @param {alt.Player} player - alt.Player - The player that is logging out.
     * @param {string} reason - The reason the player logged out.
     * @returns The player's database ID.
     */
    static tryDisconnect(player: alt.Player, reason: string): void {
        const id = player.id;

        if (DEFAULT_CONFIG.DESPAWN_VEHICLES_ON_LOGOUT && typeof id === 'number') {
            const characterID = LoginController.getDatabaseIdForPlayer(id);
            VehicleFuncs.despawnAll(characterID);
        }

        if (typeof id === 'number') {
            StorageView.removeStorageBinding(id);
        }

        if (!player || !player.valid || !player.data || !player.data._id) {
            return;
        }

        if (player.isPushingVehicle) {
            VehicleSystem.stopPush(player);
        }

        playerConst.save.onTick(player);

        if (!player.data.name) {
            return;
        }

        alt.log(`${player.data.name} has logged out.`);
    }

    /**
     * If the player has a Discord ID, and they have a valid Quick Token, then we'll try to log them in.
     * @param {alt.Player} player - alt.Player - The player that is attempting to login.
     * @param {string} discord - string - The Discord ID of the player.
     * @returns The account object.
     */
    static async tryDiscordQuickToken(player: alt.Player, discord: string): Promise<void> {
        if (!discord) {
            player.needsQT = true;
            alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
            return;
        }

        // Just enough unique data.
        const hashToken: string = Ares.getUniquePlayerHash(player, discord);
        const account: Partial<Account> | null = await Database.fetchData<Account>(
            'quickToken',
            hashToken,
            Collections.Accounts,
        );

        if (!account || !account.quickToken) {
            player.needsQT = true;
            alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
            return;
        }

        if (!account.quickTokenExpiration || Date.now() > account.quickTokenExpiration) {
            player.needsQT = true;
            Database.updatePartialData(
                account._id,
                { quickToken: null, quickTokenExpiration: null },
                Collections.Accounts,
            );
            alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
            return;
        }

        const tryQuickTokenInjections = Injections.get<TryQuickTokenCallback>(LoginInjectionNames.TRY_QUICK_TOKEN);
        for (const callback of tryQuickTokenInjections) {
            const result = await callback(player, discord);
            if (!result) {
                alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
                return;
            }
        }

        if (!account.discord) {
            player.kick("Bad Token");
            return;
        }

        player.discord = { id: account.discord } as DiscordUser;
        LoginController.tryLogin(player, account);
    }

    static async handleNoQuickToken(player: alt.Player): Promise<void> {
        player.needsQT = true;
        alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN);
    }

    static bindPlayerToID(player: alt.Player): void {
        if (!player || !player.valid || !player.data) {
            return;
        }

        UserRelation[player.id] = player.data._id.toString();
    }

    static getDatabaseIdForPlayer(id: number): string | null {
        return UserRelation[id];
    }
}

LoginController.init();
