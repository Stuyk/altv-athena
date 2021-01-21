import * as alt from 'alt-server';
import { DiscordUser } from '../interface/DiscordUser';
import { Account } from '../interface/Account';
import { goToCharacterSelect } from '../views/characters';
import { View_Events_Discord } from '../../shared/enums/views';
import { Permissions } from '../../shared/flags/permissions';
import { getUniquePlayerHash } from '../utility/encryption';
import * as sm from 'simplymongo';
import './tick';
import './voice';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { playerFuncs } from '../extensions/Player';

const db: sm.Database = sm.getDatabase();

export class LoginController {
    static async tryLogin(player: alt.Player, data: Partial<DiscordUser>, account: Partial<Account>): Promise<void> {
        delete player.pendingLogin;
        delete player.discordToken;

        if (data.username) {
            alt.log(`[Athena] (${player.id}) ${data.username} has authenticated.`);
        }

        if (account && account.discord) {
            alt.log(`[Athena] (${player.id}) Discord ${account.discord} has logged in with a Quick Token `);
        }

        const currentPlayers = [...alt.Player.all];
        const index = currentPlayers.findIndex((p) => p.discord && p.discord.id === data.id && p.id !== player.id);

        if (index >= 1) {
            player.kick('That ID is already logged in.');
            return;
        }

        player.discord = data as DiscordUser;
        alt.emitClient(player, View_Events_Discord.Close);

        // Used for DiscordToken skirt.
        if (!account) {
            // Generate New Account for Database
            let accountData: Partial<Account> | null = await db.fetchData<Account>('discord', data.id, 'accounts');
            if (!accountData) {
                const newDocument: Partial<Account> = {
                    discord: player.discord.id,
                    ips: [player.ip],
                    hardware: [player.hwidHash, player.hwidExHash],
                    lastLogin: Date.now(),
                    permissionLevel: Permissions.None
                };

                account = await db.insertData<Partial<Account>>(newDocument, 'accounts', true);
            } else {
                account = accountData;
            }
        }

        await playerFuncs.set.account(player, account);
        goToCharacterSelect(player);
    }

    static tryDisconnect(player: alt.Player, reason: string): void {
        if (!player || !player.valid || !player.data) {
            return;
        }

        const playerRef = { ...player };

        try {
            alt.log(`${playerRef.name} has logged out.`);
            playerFuncs.save.onTick(playerRef as alt.Player);
        } catch (err) {
            alt.log(`[Athena] Attempted to log player out. Player data was not found.`);
            alt.log(`[Athena] If you are seeing this message on all disconnects something went wrong above.`);
        }
    }

    static async tryDiscordQuickToken(player: alt.Player, discord: string): Promise<void> {
        if (!discord) {
            return;
        }

        // Just enough unique data.
        const hashToken: string = getUniquePlayerHash(player, discord);
        const account: Partial<Account> | null = await db.fetchData<Account>('quickToken', hashToken, 'accounts');

        if (!account) {
            player.needsQT = true;
            return;
        }

        if (!account.quickTokenExpiration || Date.now() > account.quickTokenExpiration) {
            player.needsQT = true;
            db.updatePartialData(account._id, { quickToken: null, quickTokenExpiration: null }, 'accounts');
            return;
        }

        LoginController.tryLogin(player, { id: discord }, account);
    }

    static async handleNoQuickToken(player: alt.Player): Promise<void> {
        player.needsQT = true;
    }
}

alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_NONE, LoginController.handleNoQuickToken);
alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_EMIT, LoginController.tryDiscordQuickToken);
alt.on('playerDisconnect', LoginController.tryDisconnect);
alt.on('Discord:Login', LoginController.tryLogin);
