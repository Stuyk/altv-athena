import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
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
import { VehicleSystem } from './vehicle';

type TryLoginCallback = (player: alt.Player, data: Partial<Account>) => Promise<boolean>;

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
        delete player.pendingLogin;
        delete player.discordToken;

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
            player.kick('That ID is already logged in.');
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
        if (!player || !player.valid || !player.data) {
            return;
        }

        if (player.isPushingVehicle) {
            VehicleSystem.stopPush(player);
        }

        StorageView.removeStorageBinding(player.id);

        if (DEFAULT_CONFIG.DESPAWN_VEHICLES_ON_LOGOUT) {
            VehicleFuncs.despawnAll(LoginController.getDatabaseIdForPlayer(player.id));
        }

        if (!player.data.name) {
            return;
        }

        alt.log(`${player.data.name} has logged out.`);
        playerConst.save.onTick(player);
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

        player.discord = { id: discord } as DiscordUser;
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
