import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { Account } from '../interface/iAccount';
import { Collections } from '../interface/iDatabaseCollections';

let isDoneLoading = false;
let id = -1;

const AccountSystemRef = {
    /**
     * Initializes the account system and adds ids to accounts that do not have one.
     * @static
     * @return {void}
     * @memberof AccountSystemRef
     */
    async init() {
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
                const nextIdentifier = AccountSystemRef.getNextIdentifier();
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
                const nextIdentifier = AccountSystemRef.getNextIdentifier();
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
    },
    /**
     * Wait until the `isDoneLoading` variable is set to `true` before continuing.
     */
    async isDoneLoading(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isDoneLoading) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 100);
        });
    },

    /**
     * Get next identifier
     * @static
     * @return { number }
     * @memberof AccountSystemRef
     */
    getNextIdentifier(): number {
        id += 1;
        return id;
    },

    /**
     * Fetch account for a player based on key / value pair.
     * @static
     * @param {alt.Player} player
     * @return {(Promise<Account | null>)}
     * @memberof AccountSystemRef
     */
    async getAccount(player: alt.Player, key: string, value: any): Promise<Account | null> {
        const accountData: Account | null = await Database.fetchData<Account>(key, value, Collections.Accounts);

        if (!accountData) {
            return null;
        }

        accountData._id = accountData._id.toString();


        if (accountData && (accountData.id === null || accountData.id === undefined)) {
            accountData.id = AccountSystemRef.getNextIdentifier();
        }

        return accountData;
    },

    /**
     * Create an account with default data.
     * @static
     * @param {alt.Player} player
     * @param {{[key: string]: any }} dataToAppend - Any additional data / identifiers to add to an account.
     * @return {Promise<Account>}
     * @memberof AccountSystemRef
     */
    async create(player: alt.Player, dataToAppend: { [key: string]: any }): Promise<Account> {
        await AccountSystemRef.isDoneLoading();
        const newDocument: Partial<Account> = {
            ips: [player.ip],
            hardware: [player.hwidHash, player.hwidExHash],
            lastLogin: Date.now(),
            permissionLevel: PERMISSIONS.NONE,
            id: AccountSystemRef.getNextIdentifier(),
            ...dataToAppend,
        };

        return await Database.insertData<Account>(newDocument as Account, Collections.Accounts, true);
    },
};

/**
 * It takes a function name and a callback, and if the function exists in the exports object, it
 * overrides it with the callback
 *
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback
 * @returns The function is being returned.
 */
function override<Key extends keyof typeof AccountSystemRef>(
    functionName: Key,
    callback: typeof AccountSystemRef[Key],
): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`systems/account.ts does not provide an export named ${functionName}`);
        return;
    }

    exports[functionName] = callback;
}

export const AccountSystem: typeof AccountSystemRef & { override?: typeof override } = {
    ...AccountSystemRef,
    override,
};

AccountSystem.init();
