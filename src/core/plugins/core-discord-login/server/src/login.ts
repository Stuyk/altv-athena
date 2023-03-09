import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';
import { Account } from '@AthenaServer/interface/iAccount';
import { Collections } from '@AthenaServer/database/collections';
import { DiscordUser } from '@AthenaServer/interface/iDiscordUser';
import { DevModeOverride } from '@AthenaServer/systems/dev';
import * as Athena from '@AthenaServer/api';

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

        await Athena.player.set.account(player, account);
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
            Athena.systems.loginFlow.register(player);
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
    static async tryLogin(player: alt.Player, account: Account = null): Promise<void> {
        if (!player.valid) {
            return;
        }

        delete player.pendingLogin;
        delete player.discordToken;

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
            const accountData = await Athena.systems.account.getAccount('discord', player.discord.id);

            if (!accountData) {
                const data: { discord: string; email?: string } = { discord: player.discord.id };

                if (player.discord.email) {
                    data.email = player.discord.email;
                }

                account = await Athena.systems.account.create(player, data);
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

        await Athena.player.set.account(player, account);
        Athena.systems.loginFlow.next(player);
    }
}
