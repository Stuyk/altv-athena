import * as alt from 'alt-server';
import { ILogin } from '../../shared/interfaces/register';
// import * as sm from 'simplymongo';
import { IPlayer } from '../interface/IPlayer';

// const db: sm.Database = sm.getDatabase();

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

alt.onClient('login:Start', handleRouting);

async function handleRouting(player: IPlayer, loginData: ILogin, isRegistering: boolean) {
    if (!player.pendingLogin) {
        return;
    }

    player.pendingLogin = false;
    // Do other stuff.
}
