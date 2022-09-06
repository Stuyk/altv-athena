import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { playerConst } from '../../../../server/api/consts/constPlayer';
import { DEFAULT_CONFIG } from '../../../../server/athena/main';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import VehicleFuncs from '../../../../server/extensions/vehicleFuncs';
import { Account } from '../../../../server/interface/iAccount';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { DiscordUser } from '../../../../server/interface/iDiscordUser';
import { StorageView } from '../../../../server/views/storage';
import { AccountSystem } from '../../../../server/systems/account';
import { AgendaSystem } from '../../../../server/systems/agenda';
import { Injections } from '../../../../server/systems/injections';
import { LoginInjectionNames, TryLoginCallback } from '../../../../server/systems/injections/login';
import { VehicleSystem } from '../../../../server/systems/vehicle';
import { DevModeOverride } from '../../../../server/systems/dev';

const UserRelation: { [key: number]: string } = {};
const TryLoginInjections: Array<TryLoginCallback> = [];

class InternalFunctions {
    /**
     * This is used when running 'npm run dev'.
     *
     * It automatically sets your account to the first account it finds.
     *
     * @static
     * @param {alt.Player} player
     * @memberof InternalFunctions
     */
    static async developerModeCallback(player: alt.Player) {
        const accounts = await Database.fetchAllData<Account>(Collections.Accounts);
        if (!accounts || typeof accounts[0] === 'undefined') {
            alt.logWarning(`Missing First Account...`);
            alt.logWarning(`Run the server at least once with 'npm run windows' before running dev mode.`);
            process.exit(1);
        }

        const account = accounts[0];
        player.discord = {
            id: account.discord,
        } as DiscordUser;

        await playerConst.set.account(player, account);
    }
}

export class LoginController {
    /**
     * Intialize events, and functionality first.
     *
     * @static
     * @memberof LoginController
     */
    static init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, LoginController.bindPlayerToID);
        alt.on('playerDisconnect', LoginController.tryDisconnect);
        DevModeOverride.setDevAccountCallback(InternalFunctions.developerModeCallback);
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

        if (player.discord && player.discord.username) {
            alt.log(`[Athena] (${player.id}) ${player.discord.username} has authenticated.`);
        }

        if (account && account.discord) {
            alt.log(`[Athena] (${player.id}) Discord ${account.discord} has logged in with a JWT Token `);
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
            const accountData = await AccountSystem.getAccount(player, 'discord', player.discord.id);

            if (!accountData) {
                const data: { discord: string; email?: string } = { discord: player.discord.id };

                if (player.discord.email) {
                    data.email = player.discord.email;
                }

                account = await AccountSystem.create(player, data);
                account._id = account._id.toString();
            } else {
                account = accountData;
                account._id = account._id.toString();
                if (player.discord.email && player.discord.email !== account.email) {
                    account.email = player.discord.email;
                    await Database.updatePartialData(
                        account._id,
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
