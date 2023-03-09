import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { Account } from '../interface/iAccount';
import { Collections } from '../database/collections';

const globalKey = 'accountId';

/**
 * Fetch account for a player based on key / value pair.
 *
 * @param {alt.Player} player
 * @return {(Promise<Account | undefined>)}
 * @memberof AccountSystemRef
 */
export async function getAccount(key: string, value: any): Promise<Account | undefined> {
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

 * @param {alt.Player} player
 * @param {{[key: string]: any }} dataToAppend - Any additional data / identifiers to add to an account.
 * @return {Promise<Account>}
 * @memberof AccountSystemRef
 */
export async function create(player: alt.Player, dataToAppend: { [key: string]: any }): Promise<Account> {
    await Athena.systems.global.increase(globalKey, 1, 1000);
    const nextId = await Athena.systems.global.getKey<number>(globalKey);

    const newDocument: Partial<Account> = {
        ips: [player.ip],
        hardware: [player.hwidHash, player.hwidExHash],
        lastLogin: Date.now(),
        permissions: [],
        id: nextId,
        ...dataToAppend,
    };

    return await Database.insertData<Account>(newDocument as Account, Collections.Accounts, true);
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
 * @export
 * @param {keyof AccountFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof AccountFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
