import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Account } from '../interface/iAccount';
import { Collections } from '../database/collections';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import * as Athena from '@AthenaServer/api';

/**
 * Used to ban a player from the server.
 * @static
 * @param {alt.Player} player
 * @param {string} reason
 * @return {Promise<boolean>}
 * @memberof AdminController
 */
export async function banPlayer(player: alt.Player, reason: string): Promise<boolean> {
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
 * @static
 * @param {string} discord
 * @return {Promise<boolean>}
 * @memberof AdminController
 */
export async function unbanPlayer(discord: string): Promise<boolean> {
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
    unbanPlayer: typeof unbanPlayer;
}

const Overrides: Partial<AdminControllerFuncs> = {};

export function override(functionName: 'banPlayer', callback: typeof banPlayer);
export function override(functionName: 'unbanPlayer', callback: typeof unbanPlayer);
export function override(functionName: keyof AdminControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
