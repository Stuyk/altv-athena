import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { Account } from '../interface/Account';
import { Collections } from '../interface/DatabaseCollections';

let isDoneLoading = false;
let id = -1;

export class AccountSystem {
    /**
     * Initializes the account system and adds ids to accounts that do not have one.
     * @static
     * @return {*}
     * @memberof AccountSystem
     */
    static async init() {
        const accounts = await Database.fetchAllData<Account>(Collections.Accounts);

        // Turn off loading after init
        if (accounts.length <= 0) {
            isDoneLoading = true;
            return;
        }

        // Fetch last account and just use that as the next incremental id
        const lastAccount = accounts[accounts.length - 1];
        if (lastAccount.id !== undefined && lastAccount.id !== null) {
            id = lastAccount.id;
        }

        // Add IDs for currently existing accounts
        const accountsNoIds = accounts.filter((x) => x.id === null || x.id === undefined);
        for (let i = 0; i < accountsNoIds.length; i++) {
            const nextIdentifier = AccountSystem.getNextIdentifier();
            await Database.updatePartialData(
                accountsNoIds[i]._id.toString(),
                { id: nextIdentifier },
                Collections.Accounts,
            );

            console.log(`Account ${accountsNoIds[i]._id.toString()} | Added ID: ${nextIdentifier}`);
        }

        isDoneLoading = true;
    }

    /**
     * Wait until the `isDoneLoading` variable is set to `true` before continuing.
     */
    static async isDoneLoading(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isDoneLoading) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 100);
        });
    }

    /**
     * Get next identifier
     * @static
     * @return { number }
     * @memberof AccountSystem
     */
    static getNextIdentifier(): number {
        id += 1;
        return id;
    }

    /**
     * Create an account with default data.
     * @static
     * @param {alt.Player} player
     * @return {Promise<Account>}
     * @memberof AccountSystem
     */
    static async create(player: alt.Player): Promise<Account> {
        await AccountSystem.isDoneLoading();

        const newDocument: Partial<Account> = {
            discord: player.discord.id,
            ips: [player.ip],
            hardware: [player.hwidHash, player.hwidExHash],
            lastLogin: Date.now(),
            permissionLevel: PERMISSIONS.NONE,
        };

        if (player.discord.email) {
            newDocument.email = player.discord.email;
        }

        return await Database.insertData<Account>(newDocument as Account, Collections.Accounts, true);
    }
}

AccountSystem.init();
