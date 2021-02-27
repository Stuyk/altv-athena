import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Account } from '../interface/Account';
import Logger from '../utility/athenaLogger';

const db: Database = getDatabase();

export class AdminController {
    static async banPlayer(player: alt.Player, reason: string): Promise<boolean> {
        if (!player.accountData) {
            return false;
        }

        player.kick(`[Banned] ${reason}`);
        db.updatePartialData(player.accountData._id, { banned: true, reason }, 'accounts');
        Logger.info(`(${player.discord.id}) Has been banned from the server.`);
        return true;
    }

    static async unbanPlayer(discord: string): Promise<boolean> {
        const account = await db.fetchData<Account>('discord', discord, 'accounts');
        if (!account) {
            return false;
        }

        if (!Object.prototype.hasOwnProperty.call(account, 'discord')) {
            return false;
        }

        db.updatePartialData(account._id.toString(), { banned: false, reason: null }, 'accounts');
        Logger.info(`(${discord}) Has been unbanned from the server.`);
        return true;
    }
}
