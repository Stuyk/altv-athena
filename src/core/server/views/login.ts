import * as alt from 'alt-server';
import { DiscordUser } from '../interface/DiscordUser';
import * as sm from 'simplymongo';
import { Player } from 'alt-server';
import { Account } from '../interface/Account';
import { goToCharacterSelect } from './characters';
import { View_Events_Discord } from '../../shared/enums/views';

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
const loggedInUsers: Array<DiscordUser['id']> = [];

alt.on('playerDisconnect', handleDisconnect);

/**
 * Called when the express server authenticates a user.
 * @param  {Player} player
 * @param  {DiscordUser} data
 */
export async function handleLoginRouting(player: Player, data: DiscordUser) {
    if (!player.pendingLogin) {
        return;
    }

    delete player.pendingLogin;
    delete player.discordToken;

    if (loggedInUsers.includes(data.id)) {
        alt.log(`${player.name} | Attempted to login twice under ${data.username}#${data.discriminator}.`);
        player.kick(`Already logged in.`);
        return;
    }

    loggedInUsers.push(data.id);

    player.discord = data;
    player.emit(View_Events_Discord.Close);

    let account: Partial<Account> | null = await db.fetchData<Account>('discord', data.id, 'accounts');

    // Generate New Account for Database
    if (!account) {
        const newDocument: Partial<Account> = {
            discord: player.discord.id,
            ips: [player.ip],
            hardware: [player.hwidHash, player.hwidExHash],
            lastLogin: Date.now()
        };

        account = await db.insertData<Partial<Account>>(newDocument, 'accounts', true);
    }

    // Go to Character Selection
    player.account = account._id;
    goToCharacterSelect(player);
}

/**
 * Called when a player disconnects from the server.
 * Also saves their data if they're logged in.
 * @param  {Player} player
 * @param  {string} reason
 */
function handleDisconnect(player: Player, reason: string) {
    const index = loggedInUsers.findIndex((id) => id === player.discord.id);

    // Was never logged in. Do not save data..
    if (index <= -1) {
        return;
    }

    loggedInUsers.splice(index, 1);

    if (!player.data || !player.data.appearance.name) {
        return;
    }

    alt.log(`${player.data.appearance.name} has logged out.`);
    player.data.pos = player.pos;
    player.saveField('pos', player.data.pos);
}
