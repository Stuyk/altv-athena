import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import bip39 from 'bip39';
import { AuthEvents } from '../shared/events.js';
import { AccountEx } from './interfaces/AccountEx.js';
import Database from '@stuyk/ezmongodb';

const TWENTY_FOUR_WORDS = 256; // 24 words
const PLUGIN_NAME = 'Basic Authentication';
const sessions: Array<{ id: number; expiration: number; finished?: boolean; account?: AccountEx }> = [];

function cleanupSessions() {
    for (let i = sessions.length - 1; i >= 0; i--) {
        if (sessions[i].expiration < Date.now() && !sessions[i].account) {
            const player = alt.Player.all.find((x) => x.id === sessions[i].id);
            if (!player || !player.valid) {
                continue;
            }

            player.kick('Session Expired');
            continue;
        }

        if (sessions[i].account && sessions[i].finished) {
            sessions.splice(i, 1);
            continue;
        }

        continue;
    }
}

async function beginLoginRequest(player: alt.Player) {
    sessions.push({ id: player.id, expiration: Date.now() + 60000 * 3 });
    await alt.Utils.wait(500);
    Athena.player.emit.fadeScreenToBlack(player, 0);
    player.emit(AuthEvents.toClient.requestLogin);
}

async function handleRegister(player: alt.Player, username: string, password: string) {
    if (!player || !player.valid) {
        return;
    }

    const sessionIndex = sessions.findIndex((x) => x.id === player.id);
    if (sessionIndex <= -1) {
        player.kick(`No session request found. Restart client.`);
        return;
    }

    if (sessions[sessionIndex].account) {
        player.kick(`Session request already completed. Restart client.`);
        return;
    }

    if (Date.now() > sessions[sessionIndex].expiration) {
        player.kick(`Authentication session expired. Restart client.`);
        return;
    }

    const accountDataRef = await Athena.systems.account.getAccount('username', username);
    const accountData = <AccountEx>accountDataRef;
    if (accountData) {
        Athena.webview.emit(player, AuthEvents.toWebview.showErrorMessage, 'Username is already in use.');
        return;
    }

    // Performs a one-way hash on the recovery phrase.
    // Recovery phrase is sent to the client to write down.
    const recoveryPhrase = bip39.generateMnemonic(TWENTY_FOUR_WORDS); // 24 Words
    const data: { username: string; password: string; recovery: string } = {
        username,
        password: Athena.utility.hash.hashPassword(password),
        recovery: Athena.utility.hash.sha256(recoveryPhrase),
    };

    const newAccountRef = (await Athena.systems.account.create(player, data)) as AccountEx;
    newAccountRef._id = String(newAccountRef._id);
    sessions[sessionIndex].account = newAccountRef;
    Athena.webview.emit(player, AuthEvents.toWebview.showSeedPhrase, recoveryPhrase);
}

async function handleLogin(player: alt.Player, username: string, password: string) {
    if (!player || !player.valid) {
        return;
    }

    const sessionIndex = sessions.findIndex((x) => x.id === player.id);
    if (sessionIndex <= -1) {
        player.kick(`No session request found. Restart client.`);
        return;
    }

    if (sessions[sessionIndex].account) {
        player.kick(`Session request already completed. Restart client.`);
        return;
    }

    if (Date.now() > sessions[sessionIndex].expiration) {
        player.kick(`Authentication session expired. Restart client.`);
        return;
    }

    const accountDataRef = await Athena.systems.account.getAccount('username', username);
    if (!accountDataRef) {
        // We use the same message here becauses it makes it ambiguous for bad actors.
        Athena.webview.emit(player, AuthEvents.toWebview.showErrorMessage, 'Username or Password does not match.');
        return;
    }

    const accountData = <AccountEx>accountDataRef;
    accountData._id = accountData._id.toString();

    if (!Athena.utility.hash.testPassword(password, accountData.password)) {
        Athena.webview.emit(player, AuthEvents.toWebview.showErrorMessage, 'Username or Password does not match.');
        return;
    }

    sessions[sessionIndex].finished = true;

    if (accountData.banned) {
        player.kick(accountData.reason);
        return;
    }

    const loggedInPlayer = Athena.getters.player.byDatabaseID(accountData._id.toString());
    if (typeof loggedInPlayer !== 'undefined') {
        player.kick(`Already Logged In`);
        return;
    }

    sessions[sessionIndex].account = accountData;
    handleFinish(player);
}

async function handleFinish(player: alt.Player) {
    const sessionIndex = sessions.findIndex((x) => x.id === player.id);
    if (sessionIndex <= -1 || !sessions[sessionIndex].account) {
        player.kick(`No session request found. Restart client.`);
        return;
    }

    player.emit(AuthEvents.toClient.endLogin);
    await Athena.player.set.account(player, sessions[sessionIndex].account);
    Athena.systems.loginFlow.next(player);
    alt.log(`${sessions[sessionIndex].account.username} has authenticated.`);
    sessions[sessionIndex].finished = true;
}

/**
 * Requires a multi-word bip39 based seed phrase to recover an account.
 *
 * @param {alt.Player} player
 * @param {string} seedPhrase
 * @return {*}
 */
async function handleRecovery(player: alt.Player, seedPhrase: string, newPassword: string) {
    const sessionIndex = sessions.findIndex((x) => x.id === player.id);
    if (sessionIndex <= -1) {
        player.kick(`No session request found. Restart client.`);
        return;
    }

    const hash = Athena.utility.hash.sha256(seedPhrase);
    const accountDataRef = await Athena.systems.account.getAccount('recovery', hash);

    // In order to slow down any attacks, we simply kick the client on a bad phrase.
    if (typeof accountDataRef === 'undefined') {
        player.kick(`Invalid recovery phrase. Restart client.`);
        return;
    }

    // Example Phrase: 'apology paper violin fruit tobacco oil gym west skate club empower fatigue scatter cup slight tobacco rookie output castle load tennis glimpse pumpkin reject'
    const recoveryPhrase = bip39.generateMnemonic(TWENTY_FOUR_WORDS);
    const accountData = <AccountEx>accountDataRef;
    sessions[sessionIndex].account = accountData;
    sessions[sessionIndex].account._id = String(sessions[sessionIndex].account._id);
    sessions[sessionIndex].account = accountData;
    sessions[sessionIndex].account.password = Athena.utility.hash.hashPassword(newPassword);
    sessions[sessionIndex].account.recovery = Athena.utility.hash.sha256(recoveryPhrase);

    console.log(`Generated new phrase for ${accountData.username}`);

    await Database.updatePartialData(
        accountData._id.toString(),
        { password: sessions[sessionIndex].account.password, recovery: sessions[sessionIndex].account.recovery },
        Athena.database.collections.Accounts,
    );

    Athena.webview.emit(player, AuthEvents.toWebview.showSeedPhrase, recoveryPhrase);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    Athena.systems.loginFlow.add('authentication', 1, beginLoginRequest);
    alt.onClient(AuthEvents.toServer.tryLogin, handleLogin);
    alt.onClient(AuthEvents.toServer.tryRegister, handleRegister);
    alt.onClient(AuthEvents.toServer.tryRecovery, handleRecovery);
    alt.onClient(AuthEvents.toServer.finishLogin, handleFinish);
    alt.setInterval(cleanupSessions, 5000);
});
