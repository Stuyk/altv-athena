import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import Database from '@stuyk/ezmongodb';
import { KnownKeys } from '@AthenaShared/utility/knownKeys.js';
import { Account } from '@AthenaShared/interfaces/iAccount.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';

export type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;

const SessionKey = 'athena-document-account-data';

declare global {
    namespace AthenaSession {
        interface Player {
            [SessionKey]: Account;
        }
    }
}

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const restrictedFields = ['username', 'password', 'salt', 'hardware', 'ips', 'banned'];

/**
 * Removes restricted fields to be passed to the player.
 *
 * @param {Account} data
 * @return {Partial<Account>}
 */
function removeRestrictedFields(data: Account): Partial<Account> {
    for (let fieldName of restrictedFields) {
        delete data[fieldName];
    }

    return data;
}

/**
 * Binds a player identifier to a Account document.
 * This document is cleared on disconnected automatically.
 * This should be the first thing you do after having a user authenticate.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Account} document
 */
export function bind(player: alt.Player, document: Account) {
    if (Overrides.bind) {
        return Overrides.bind(player, document);
    }

    if (document._id) {
        document._id = document._id.toString();
    }

    if (document.banned) {
        player.kick(document.reason ? document.reason : 'Banned');
        return;
    }

    Athena.session.player.set(player, SessionKey, document);

    try {
        const dataCopy = deepCloneObject<Account>(document);
        const cleanedData = removeRestrictedFields(dataCopy);
        Athena.webview.emit(player, SYSTEM_EVENTS.PLAYER_EMIT_ACCOUNT_STATE, cleanedData);
        Athena.config.player.set(player, 'account-data', cleanedData);
    } catch (err) {}
}

/**
 * Unbind stored player character cache data.
 *
 * @param {number} id
 */
export function unbind(id: number) {
    if (Overrides.unbind) {
        return Overrides.unbind(id);
    }

    Athena.session.player.clearKey(id, SessionKey);
}

/**
 * Return current player data and their associated account object.
 *
 * @template T
 * @param {alt.Player} player An alt:V Player Entity
 * @return {T = Character}
 */
export function get<T = Account>(player: alt.Player): T | undefined {
    if (Overrides.get) {
        return Overrides.get(player);
    }

    return <T>Athena.session.player.get(player, SessionKey);
}

type Combine<A, B> = A & B;

/**
 * Get the current value of a specific field inside of the player data object.
 * Can be extended to obtain any value easily.
 *
 * @template T
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(keyof KnownKeys<Account & T>)} fieldName
 * @return {void}
 */
export function getField<T = {}, ReturnType = any>(
    player: alt.Player,
    fieldName: keyof KnownKeys<Account & T>,
): ReturnType | undefined {
    if (Overrides.getField) {
        return Overrides.getField(player, fieldName);
    }

    if (!Athena.session.player.has(player, SessionKey)) {
        return undefined;
    }

    return Athena.session.player.get(player, SessionKey)[String(fieldName)];
}

/**
 * Sets a player document value, and saves it automatically to the selected account database.
 * Automatically calls all callbacks associated with the field name.
 *
 * @template T
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(keyof KnownKeys<Character & T>)} fieldName
 * @param {*} value
 * @return {void}
 */
export async function set<T = {}, Keys = keyof KnownKeys<Account & T>>(
    player: alt.Player,
    fieldName: Keys,
    value: any,
) {
    if (Overrides.set) {
        return Overrides.set(player, fieldName, value);
    }

    if (!Athena.session.player.has(player, SessionKey)) {
        return undefined;
    }

    const typeSafeFieldName = String(fieldName);
    let data = Athena.session.player.get(player, SessionKey);
    let oldValue = undefined;

    if (data[typeSafeFieldName]) {
        oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
    }

    const newData = { [typeSafeFieldName]: value };

    data = Object.assign(data, newData);
    Athena.session.player.set(player, SessionKey, data);
    await Database.updatePartialData(data._id, newData, Athena.database.collections.Accounts);

    try {
        const dataCopy = deepCloneObject<Account>(data);
        const cleanedData = removeRestrictedFields(dataCopy);
        Athena.config.player.set(player, 'account-data', cleanedData);
        Athena.webview.emit(player, SYSTEM_EVENTS.PLAYER_EMIT_ACCOUNT_STATE, cleanedData);
    } catch (err) {}

    if (typeof callbacks[typeSafeFieldName] === 'undefined') {
        return;
    }

    for (let cb of callbacks[typeSafeFieldName]) {
        cb(player, value, oldValue);
    }
}

/**
 * Sets player document values, and saves it automatically to the selected Account's database.
 * Automatically calls all callbacks associated with the field name.
 *
 * @template T
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(Partial<Account & T>)} fields
 * @returns {void}
 */
export async function setBulk<T = {}, Keys = Partial<Account & T>>(player: alt.Player, fields: Keys) {
    if (Overrides.setBulk) {
        return Overrides.setBulk(player, fields);
    }

    if (!Athena.session.player.has(player, SessionKey)) {
        return undefined;
    }

    let data = Athena.session.player.get(player, SessionKey);

    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        if (typeof data[key] === 'undefined') {
            oldValues[key] = undefined;
            return;
        }

        oldValues[key] = JSON.parse(JSON.stringify(data[key]));
    });

    data = Object.assign(data, fields);
    Athena.session.player.set(player, SessionKey, data);
    await Database.updatePartialData(data._id, fields, Athena.database.collections.Accounts);

    try {
        const dataCopy = deepCloneObject<Account>(data);
        const cleanedData = removeRestrictedFields(dataCopy);
        Athena.webview.emit(player, SYSTEM_EVENTS.PLAYER_EMIT_ACCOUNT_STATE, cleanedData);
        Athena.config.player.set(player, 'account-data', cleanedData);
    } catch (err) {}

    Object.keys(fields).forEach((key) => {
        if (typeof callbacks[key] === 'undefined') {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(player, data[key], oldValues[key]);
        }
    });
}

/**
 * Listen for individual player document changes.
 *
 * @param {string} fieldName
 * @param {KeyChangeCallback} callback
 * @return {void}
 */
export function onChange<T = {}>(fieldName: keyof KnownKeys<Account & T>, callback: KeyChangeCallback) {
    if (Overrides.onChange) {
        return Overrides.onChange(fieldName, callback);
    }

    const actualFieldName = String(fieldName);

    if (typeof callbacks[actualFieldName] === 'undefined') {
        callbacks[actualFieldName] = [callback];
    } else {
        callbacks[actualFieldName].push(callback);
    }
}

interface AccountDataDocFuncs {
    bind: typeof bind;
    unbind: typeof unbind;
    get: typeof get;
    getField: typeof getField;
    set: typeof set;
    setBulk: typeof setBulk;
    onChange: typeof onChange;
}

const Overrides: Partial<AccountDataDocFuncs> = {};

export function override(functionName: 'bind', callback: typeof bind);
export function override(functionName: 'unbind', callback: typeof unbind);
export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'getField', callback: typeof getField);
export function override(functionName: 'set', callback: typeof set);
export function override(functionName: 'setBulk', callback: typeof setBulk);
export function override(functionName: 'onChange', callback: typeof onChange);

/**
 * Used to override any account data document functionality
 *
 *
 * @param {keyof AccountDataDocFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof AccountDataDocFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
