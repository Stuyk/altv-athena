import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import Database from '@stuyk/ezmongodb';
import { Account } from '../../shared/interfaces/iAccount.js';
import { Collections } from '../database/collections.js';

const globalKey = 'accountId';
let adminAccountCreated = false;

const Internal = {
    async init() {
        adminAccountCreated = await Internal.doesAtLeastOneAccountExist();
    },
    /**
     * Checks the accounts collection to see if at least one account has been created.
     *
     * If more than one account has been created. Assume the first connected account needs admin permission.
     *
     * @return {Promise<boolean>}
     */
    async doesAtLeastOneAccountExist(): Promise<boolean> {
        const db = await Database.getDatabaseInstance();
        const collection = db.collection(Athena.database.collections.Accounts);
        const count = await collection.estimatedDocumentCount();
        return count >= 1;
    },
};

/**
 * Fetch account for a player based on key / value pair.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {(Promise<Account | undefined>)}
 *
 */
export async function getAccount(key: string, value: any): Promise<Account | undefined> {
    if (Overrides.getAccount) {
        return await Overrides.getAccount(key, value);
    }

    const accountData: Account | null = await Database.fetchData<Account>(key, value, Collections.Accounts);

    if (!accountData) {
        return undefined;
    }

    accountData._id = String(accountData._id);

    if (accountData && (accountData.id === null || accountData.id === undefined)) {
        await Athena.systems.global.increase(globalKey, 1, 1000);
        const nextId = await Athena.systems.global.getKey(globalKey);
        await Database.updatePartialData(accountData._id, { id: nextId }, Collections.Accounts);
    }

    return accountData;
}

/**
 * Create an account with default data.

 * @param {alt.Player} player An alt:V Player Entity
 * @param {{[key: string]: any }} dataToAppend - Any additional data / identifiers to add to an account.
 * @return {Promise<Account>}
 *
 */
export async function create(player: alt.Player, dataToAppend: { [key: string]: any }): Promise<Account> {
    if (Overrides.create) {
        return await Overrides.create(player, dataToAppend);
    }

    await Athena.systems.global.increase(globalKey, 1, 1000);
    const nextId = await Athena.systems.global.getKey<number>(globalKey);

    let permissions = [];
    let wasAdminAccountCreated = false;
    if (!adminAccountCreated) {
        permissions.push('admin');
        wasAdminAccountCreated = true;
        adminAccountCreated = true;
    }

    const newDocument: Partial<Account> = {
        ips: [player.ip],
        hardware: [player.hwidHash, player.hwidExHash],
        lastLogin: Date.now(),
        permissions,
        id: nextId,
        ...dataToAppend,
    };

    const newAccount = await Database.insertData<Account>(newDocument as Account, Collections.Accounts, true);
    newAccount._id = newAccount._id.toString();

    if (wasAdminAccountCreated) {
        alt.log(`~y~Account with ID ${newAccount._id} was given Admin Permissions. This only happens once.`);
    }

    Athena.player.events.trigger('set-account-data', player);
    return newAccount;
}

interface AccountFuncs {
    create: typeof create;
    getAccount: typeof getAccount;
}

const Overrides: Partial<AccountFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
export function override(functionName: 'getAccount', callback: typeof getAccount);

/**
 * Used to override any account system functionality
 *
 *
 * @param {keyof AccountFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof AccountFuncs, callback: any): void {
    Overrides[functionName] = callback;
}

Internal.init();
