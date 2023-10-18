import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import Database from '@stuyk/ezmongodb';
import axios from 'axios';
import { Account } from '@AthenaShared/interfaces/iAccount.js';
import { DiscordAuthConfig } from './config.js';
import { DiscordAuthEvents } from '../shared/events.js';

const PLUGIN_NAME = 'Discord Authentication';
const sessions: Array<{ id: number; expiration: number; finished?: boolean }> = [];

interface DiscordInfo {
    id: string;
    username: string;
    avatar: string;
    mfa_enabled: boolean;
    email: string;
    discriminator: string;
}

function cleanupSessions() {
    let count = 0;
    let kickCount = 0;
    for (let i = sessions.length - 1; i >= 0; i--) {
        if (sessions[i].expiration > Date.now() && !sessions[i].finished) {
            continue;
        }

        const player = alt.Player.all.find((x) => x.id === sessions[i].id);
        if (player && player.valid && !sessions[i].finished) {
            player.kick('Session Expired. Restart client.');
            kickCount += 1;
        }

        count += 1;
        sessions.splice(i, 1);
        break;
    }

    if (count >= 1) {
        alt.log(`Cleaned Sessions for Authorization: ${count} `);
    }

    if (kickCount >= 1) {
        alt.log(`Kicked ${kickCount} for waiting too long to login.`);
    }
}

async function beginTokenRequest(player: alt.Player) {
    sessions.push({ id: player.id, expiration: Date.now() + 60000 * 3 });
    await alt.Utils.wait(500);
    Athena.player.emit.fadeScreenToBlack(player, 0);
    Athena.player.emit.createErrorScreen(player, {
        title: 'Discord Auth',
        text: 'Tab out, and check Discord',
        text2: 'Discord must be open when you start alt:V to Authenticate',
        duration: -1,
    });

    player.emit(DiscordAuthEvents.toClient.requestToken, DiscordAuthConfig.APPLICATION_ID);
}

async function handleToken(player: alt.Player, token: string) {
    if (!player || !player.valid) {
        return;
    }

    Athena.player.emit.clearErrorScreen(player);
    Athena.player.emit.createSpinner(player, { duration: -1, text: 'Authenticating', type: 1 });

    const sessionIndex = sessions.findIndex((x) => x.id === player.id);
    if (sessionIndex <= -1) {
        player.kick(`No session request found. Restart client.`);
        return;
    }

    if (sessions[sessionIndex].finished) {
        player.kick(`Session request already completed. Restart client.`);
        return;
    }

    sessions[sessionIndex].finished = true;

    if (Date.now() > sessions[sessionIndex].expiration) {
        player.kick(`Authentication session expired. Restart client.`);
        return;
    }

    if (!token) {
        player.kick(`Failed to Authenticate with Discord. Restart client.`);
        return;
    }

    const request = await axios
        .get('https://discordapp.com/api/users/@me', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((err) => {
            return undefined;
        });

    // Check if the request was successful and if the neccessary properties are included
    if (!request || !request.data || !request.data.id || !request.data.username) {
        player.kick('Authorization Failed. Restart client.');
        return;
    }

    const discordInfo: DiscordInfo = request.data;
    const accountData = await Athena.systems.account.getAccount('discord', discordInfo.id);
    let account: Account;

    if (!accountData) {
        const data: { discord: string; email?: string } = { discord: discordInfo.id, email: discordInfo.email };
        account = await Athena.systems.account.create(player, data);
        account._id = account._id.toString();
    } else {
        account = accountData;
        account._id = account._id.toString();
        if (!account.email) {
            await Database.updatePartialData(
                account._id,
                { email: discordInfo.email },
                Athena.database.collections.Accounts,
            );
        }
    }

    if (account.banned) {
        player.kick(account.reason);
        return;
    }

    const loggedInPlayer = Athena.getters.player.byDatabaseID(account._id.toString());
    if (typeof loggedInPlayer !== 'undefined') {
        player.kick(`Already Logged In`);
        return;
    }

    Athena.player.emit.clearSpinner(player);

    await Athena.player.set.account(player, account);
    Athena.systems.loginFlow.next(player);

    const name = discordInfo.username + '#' + discordInfo.discriminator;
    alt.log(`${name} has authenticated.`);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    Athena.systems.loginFlow.add('authentication', 1, beginTokenRequest);
    alt.onClient(DiscordAuthEvents.toServer.pushToken, handleToken);
    alt.setInterval(cleanupSessions, 5000);
});
