import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Account } from '../interface/Account';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';

export class AdminController {
    static async banPlayer(player: alt.Player, reason: string): Promise<boolean> {
        if (!player.accountData) {
            return false;
        }

        player.kick(`[Banned] ${reason}`);
        Database.updatePartialData(player.accountData._id, { banned: true, reason }, Collections.Accounts);
        Logger.info(`(${player.discord.id}) Has been banned from the server.`);
        return true;
    }

    static async unbanPlayer(discord: string): Promise<boolean> {
        const account = await Database.fetchData<Account>('discord', discord, Collections.Accounts);
        if (!account) {
            return false;
        }

        if (!account.hasOwnProperty('discord')) {
            return false;
        }

        await Database.updatePartialData(account._id.toString(), { banned: false, reason: null }, Collections.Accounts);
        Logger.info(`(${discord}) Has been unbanned from the server.`);
        return true;
    }
}
