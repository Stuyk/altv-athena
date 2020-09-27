import * as alt from 'alt-server';
import { IDiscordUser } from '../interface/IDiscordUser';
import * as sm from 'simplymongo';
import { Player } from 'alt-server';

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
const loggedInUsers: Array<IDiscordUser['id']> = [];

export async function handleLogin(player: Player, data: IDiscordUser) {
    if (!player.pendingLogin) {
        return;
    }

    delete player.pendingLogin;
    delete player.discordToken;

    if (loggedInUsers.includes(data.id)) {
        player.kick(`Already logged in.`);
        return;
    }

    player.discord = data;
    player.safeSetPosition(0, 0, 0);
    alt.emitClient(player, 'discord:Close');
}

// export async function logoutPlayer(player: IPlayer) {}
