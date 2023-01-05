import * as alt from 'alt-server';
import { KnownKeys } from '@AthenaShared/utility/knownKeys';
import { databaseConst as Database } from '@AthenaServer/api/consts/constDatabase';
import { Account } from '@AthenaServer/interface/iAccount';

type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const cache: { [id: string]: Account } = {};
const DEBUG_MODE = false; // Use this to see what state is being set.

/**
 * Binds a player identifier to a Account document.
 * This document is cleared on disconnected automatically.
 * This should be the first thing you do after having a user authenticate.
 *
 * @param {alt.Player} player
 * @param {Account} document
 */
function bind(player: alt.Player, document: Account) {
    if (document._id) {
        document._id = document._id.toString();
    }

    cache[player.id] = document;
}

/**
 * Unbind stored player character cache data.
 *
 * @param {number} id
 */
function unbind(id: number) {
    delete cache[id];
}

/**
 * Return current player data and their associated account object.
 *
 * @template T
 * @param {alt.Player} player
 * @return {T = Character}
 */
function get<T = Account>(player: alt.Player): T | undefined {
    return cache[player.id] as T;
}

/**
 * Get the current value of a specific field inside of the player data object.
 * Can be extended to obtain any value easily.
 *
 * @template T
 * @param {alt.Player} player
 * @param {(keyof KnownKeys<Account & T>)} fieldName
 * @return {*}
 */
function getField<T = {}, ReturnType = any>(
    player: alt.Player,
    fieldName: keyof KnownKeys<Account & T>,
): ReturnType | undefined {
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
 * @param {alt.Player} player
 * @param {(keyof KnownKeys<Character & T>)} fieldName
 * @param {*} value
 * @return {void}
 */
async function set<T = {}, Keys = keyof KnownKeys<Account & T>>(player: alt.Player, fieldName: Keys, value: any) {
    if (!cache[player.id]) {
        return undefined;
    }

    const typeSafeFieldName = String(fieldName);
    const oldValue = JSON.parse(JSON.stringify(cache[player.id][typeSafeFieldName]));
    const newData = { [typeSafeFieldName]: value };

    cache[player.id] = Object.assign(cache[player.id], newData);
    await Database.funcs.updatePartialData(cache[player.id]._id, newData, Database.collections.Accounts);

    if (DEBUG_MODE) {
        alt.logWarning(
            `DEBUG: ${cache[player.id]._id} state updated for ${typeSafeFieldName} with value: ${JSON.stringify(
                newData,
            )}`,
        );
    }

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
 * @param {alt.Player} player
 * @param {(Partial<Account & T>)} fields
 * @returns {void}
 */
async function setBulk<T = {}, Keys = Partial<Account & T>>(player: alt.Player, fields: Keys) {
    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        oldValues[key] = JSON.parse(JSON.stringify(cache[player.id][key]));
    });

    cache[player.id] = Object.assign(cache[player.id], fields);
    await Database.funcs.updatePartialData(cache[player.id]._id, fields, Database.collections.Accounts);

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
function onChange<T = {}>(fieldName: keyof KnownKeys<Account & T>, callback: KeyChangeCallback) {
    const actualFieldName = String(fieldName);

    if (typeof callbacks[actualFieldName] === 'undefined') {
        callbacks[actualFieldName] = [callback];
    } else {
        callbacks[actualFieldName].push(callback);
    }
}

export const AccountDocument = {
    bind,
    get,
    getField,
    onChange,
    set,
    setBulk,
    unbind,
};

alt.on('playerDisconnect', (player: alt.Player) => {
    if (typeof player.id === 'undefined' || player.id === null) {
        return;
    }

    unbind(player.id);
});
