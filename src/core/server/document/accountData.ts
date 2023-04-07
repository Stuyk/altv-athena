import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import Database from '@stuyk/ezmongodb';
import { KnownKeys } from '@AthenaShared/utility/knownKeys';
import { Account } from '@AthenaShared/interfaces/iAccount';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';

export type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const cache: { [id: string]: Account } = {};
const DEBUG_MODE = false; // Use this to see what state is being set.

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

    cache[player.id] = document;

    try {
        const dataCopy = deepCloneObject<Account>(cache[player.id]);
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

    delete cache[id];
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

    return cache[player.id] as T;
}

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

    if (!cache[player.id]) {
        return undefined;
    }

    return cache[player.id][String(fieldName)];
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

    if (!cache[player.id]) {
        return undefined;
    }

    const typeSafeFieldName = String(fieldName);
    let oldValue = undefined;
    if (cache[player.id][typeSafeFieldName]) {
        oldValue = JSON.parse(JSON.stringify(cache[player.id][typeSafeFieldName]));
    }
    const newData = { [typeSafeFieldName]: value };

    cache[player.id] = Object.assign(cache[player.id], newData);
    await Database.updatePartialData(cache[player.id]._id, newData, Athena.database.collections.Accounts);

    if (DEBUG_MODE) {
        alt.logWarning(
            `DEBUG: ${cache[player.id]._id} state updated for ${typeSafeFieldName} with value: ${JSON.stringify(
                newData,
            )}`,
        );
    }

    try {
        const dataCopy = deepCloneObject<Account>(cache[player.id]);
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

    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        oldValues[key] = JSON.parse(JSON.stringify(cache[player.id][key]));
    });

    cache[player.id] = Object.assign(cache[player.id], fields);
    await Database.updatePartialData(cache[player.id]._id, fields, Athena.database.collections.Accounts);

    try {
        const dataCopy = deepCloneObject<Account>(cache[player.id]);
        const cleanedData = removeRestrictedFields(dataCopy);
        Athena.webview.emit(player, SYSTEM_EVENTS.PLAYER_EMIT_ACCOUNT_STATE, cleanedData);
        Athena.config.player.set(player, 'account-data', cleanedData);
    } catch (err) {}

    Object.keys(fields).forEach((key) => {
        if (typeof callbacks[key] === 'undefined') {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(player, cache[player.id][key], oldValues[key]);
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

alt.on('playerDisconnect', (player: alt.Player) => {
    if (typeof player.id === 'undefined' || player.id === null) {
        return;
    }

    unbind(player.id);
});

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
