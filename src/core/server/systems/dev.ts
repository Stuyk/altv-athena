import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/extPlayer';
import { Account } from '../interface/iAccount';
import { Collections } from '../interface/iDatabaseCollections';
import { DiscordUser } from '../interface/iDiscordUser';
import { AgendaOrder, AgendaSystem } from './agenda';

export class DevModeOverride {
    /**
     * Overrides the default login and uses a single account for all users.
     * This acts a way to login to multiple accounts under multiple instances of GTA:V.
     *
     * @param player - alt.Player - The player that is logging in.
     * @returns None
     */
    static async login(player: alt.Player) {
        const accounts = await Database.fetchAllData<Account>(Collections.Accounts);
        const account = accounts[0];

        player.discord = {
            id: account.discord,
        } as DiscordUser;

        playerFuncs.set.firstConnect(player);

        AgendaSystem.init(player);
        AgendaSystem.goToAgenda(player, AgendaOrder.ACCOUNT_SETUP);
    }
}
