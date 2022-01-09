import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { Account } from '../interface/iAccount';
import { Collections } from '../interface/iDatabaseCollections';

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
        let accounts = await Database.fetchAllData<Account>(Collections.Accounts);

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

        // De-duplicate entries
        let inUse = [];
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id === null || accounts[i].id === undefined) {
                const nextIdentifier = AccountSystem.getNextIdentifier();
                await Database.updatePartialData(
                    accounts[i]._id.toString(),
                    { id: nextIdentifier },
                    Collections.Accounts,
                );

                console.log(`Account ${accounts[i]._id.toString()} | Added ID: ${nextIdentifier}`);
                inUse.push(nextIdentifier);
                continue;
            }

            if (inUse.findIndex((id) => id === accounts[i].id) >= 0) {
                const nextIdentifier = AccountSystem.getNextIdentifier();
                await Database.updatePartialData(
                    accounts[i]._id.toString(),
                    { id: nextIdentifier },
                    Collections.Accounts,
                );

                console.log(`Account ${accounts[i]._id.toString()} De-Duplicated | Added ID: ${nextIdentifier}`);
                inUse.push(nextIdentifier);
                continue;
            }

            inUse.push(accounts[i].id);
            continue;
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
     * Fetch account for player who has discord information.
     * @static
     * @param {alt.Player} player
     * @return {(Promise<Account | null>)}
     * @memberof AccountSystem
     */
    static async getAccount(player: alt.Player): Promise<Account | null> {
        if (!player.discord) {
            return null;
        }

        const accountData: Account | null = await Database.fetchData<Account>(
            'discord',
            player.discord.id,
            Collections.Accounts,
        );

        if (!accountData) {
            return null;
        }

        if (accountData && (accountData.id === null || accountData.id === undefined)) {
            accountData.id = AccountSystem.getNextIdentifier();
        }

        return accountData;
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
            id: AccountSystem.getNextIdentifier(),
        };

        if (player.discord.email) {
            newDocument.email = player.discord.email;
        }

        return await Database.insertData<Account>(newDocument as Account, Collections.Accounts, true);
    }
}

AccountSystem.init();
