import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Account } from '../../shared/interfaces/iAccount.js';
import { Collections } from '../database/collections.js';
import { LocaleController } from '../../shared/locale/locale.js';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys.js';
import * as Athena from '@AthenaServer/api/index.js';

/**
 * Used to ban a player from the server.
 *
 * #### Example
 * ```ts
 * Athena.controllers.admin.banPlayer(player, 'was a bad person :(')
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} reason
 * @return {Promise<boolean>}
 */
export async function banPlayer(player: alt.Player, reason: string): Promise<boolean> {
    if (Overrides.banPlayer) {
        return Overrides.banPlayer(player, reason);
    }

    const accountData = Athena.document.account.get(player);
    if (typeof accountData === 'undefined') {
        return false;
    }

    player.kick(`${LocaleController.get(LOCALE_KEYS.LABEL_BANNED)} ${reason}`);
    await Athena.document.account.setBulk(player, { banned: true, reason });

    if (player.discord && player.discord.id) {
        alt.log(`(${player.discord.id}) Has been banned from the server.`);
    }
    return true;
}

/**
 * Used to unban a player from the server.
 *
 * #### Example
 * ```ts
 * Athena.controllers.admin.unbanPlayerByDiscord('202685967935471617');
 * ```
 *
 * @param {string} discord
 * @return {Promise<boolean>}
 *
 */
export async function unbanPlayerByDiscord(discord: string): Promise<boolean> {
    if (Overrides.unbanPlayerByDiscord) {
        return Overrides.unbanPlayerByDiscord(discord);
    }

    const account = await Database.fetchData<Account>('discord', discord, Collections.Accounts);
    if (!account) {
        return false;
    }

    if (!account.hasOwnProperty('discord')) {
        return false;
    }

    await Database.updatePartialData(account._id.toString(), { banned: false, reason: null }, Collections.Accounts);
    alt.log(`(${discord}) Has been unbanned from the server.`);
    return true;
}

interface AdminControllerFuncs {
    banPlayer: typeof banPlayer;
    unbanPlayerByDiscord: typeof unbanPlayerByDiscord;
}

const Overrides: Partial<AdminControllerFuncs> = {};

export function override(functionName: 'banPlayer', callback: typeof banPlayer);
export function override(functionName: 'unbanPlayerByDiscord', callback: typeof unbanPlayerByDiscord);
export function override(functionName: keyof AdminControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
