import * as alt from 'alt-server';
import { DiscordUser } from '../interface/DiscordUser';
import * as sm from 'simplymongo';
import { Player } from 'alt-server';
import { Account } from '../interface/Account';
import { goToCharacterSelect } from '../views/characters';
import { View_Events_Discord } from '../../shared/enums/views';
import { Permissions } from '../../shared/enums/permissions';
import './tick';
import './voice';

export default function () {
    alt.on('playerDisconnect', handleDisconnect);
    alt.on('Discord:Login', handleLoginRouting);
}

/**
 * Why Discord Login?
 * 1. It doesn't cost you a dime to verify a user.
 * 2. It has great uptime.
 * 3. It doesn't require sending or storing user emails.
 * 4. It doesn't require storing user passwords.
 * 5. It brings community members to your Discord to join.
 * 6. It doesn't require a password reset for a user to join.
 * 7. It allows you to easily ban a user via Discord.
 * 8. Harder bans can occur if your server requires Phone Verification.
 *
 * Yea that about sums up why Discord Login (oAuth2) > Everything else atm.
 */

const db: sm.Database = sm.getDatabase();

/**
 * Called when the express server authenticates a user.
 * @param  {Player} player
 * @param  {DiscordUser} data
 */
export async function handleLoginRouting(player: Player, data: Partial<DiscordUser>): Promise<void> {
    delete player.pendingLogin;
    delete player.discordToken;

    if (data.username) {
        alt.log(`[Athena] (${player.id}) ${data.username} has authenticated.`);
    }

    const currentPlayers = [...alt.Player.all];
    const index = currentPlayers.findIndex((p) => p.discord && p.discord.id === data.id && p.id !== player.id);

    if (index >= 1) {
        player.kick('That ID is already logged in.');
        return;
    }

    player.discord = data as DiscordUser;
    player.emit(View_Events_Discord.Close);
    player.emit('Login:FadeScreenIn');

    let account: Partial<Account> | null = await db.fetchData<Account>('discord', data.id, 'accounts');

    // Generate New Account for Database
    if (!account) {
        const newDocument: Partial<Account> = {
            discord: player.discord.id,
            ips: [player.ip],
            hardware: [player.hwidHash, player.hwidExHash],
            lastLogin: Date.now(),
            permissionLevel: Permissions.None
        };

        account = await db.insertData<Partial<Account>>(newDocument, 'accounts', true);
    }

    await player.setAccountData(account);

    goToCharacterSelect(player);
}

/**
 * Called when a player disconnects from the server.
 * Also saves their data if they're logged in.
 * @param  {Player} player
 * @param  {string} reason
 */
function handleDisconnect(player: Player, reason: string): void {
    // Was never logged in. Do not save data..
    if (!player.data || !player.name || player.pendingCharacterSelect || player.pendingCharacterEdit) {
        return;
    }

    try {
        alt.log(`${player.name} has logged out.`);
        player.data.pos = player.pos;
        player.saveField('pos', player.data.pos);
    } catch (err) {
        alt.log(`[Athena] Attempted to log player out. Player data was not found.`);
        alt.log(`[Athena] If you are seeing this message on all disconnects something went wrong above.`);
    }
}
