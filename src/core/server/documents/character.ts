import * as alt from 'alt-server';
import { Character } from '@AthenaShared/interfaces/character';
import { KnownKeys } from '@AthenaShared/utility/knownKeys';
import { databaseConst as Database } from '@AthenaServer/api/consts/constDatabase';

type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;

const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};

/**
 * Return current player data and their associated character object.
 *
 * @template T
 * @param {alt.Player} player
 * @return {T = Character}
 */
function get<T = Character>(player: alt.Player): T {
    return player.data as T;
}

/**
 * Get the current value of a specific field inside of the player data object.
 * Can be extended to obtain any value easily.
 *
 * @template T
 * @param {alt.Player} player
 * @param {(keyof KnownKeys<Character & T>)} fieldName
 * @return {*}
 */
function getField<T = {}>(player: alt.Player, fieldName: keyof KnownKeys<Character & T>) {
    return player.data[String(fieldName)];
}

/**
 * Sets a player document value, and saves it automatically to the selected character's database.
 * Automatically calls all callbacks associated with the field name.
 *
 * @template T
 * @param {alt.Player} player
 * @param {(keyof KnownKeys<Character & T>)} fieldName
 * @param {*} value
 * @return {void}
 */
async function set<T = {}>(player: alt.Player, fieldName: keyof KnownKeys<Character & T>, value: any) {
    const typeSafeFieldName = String(fieldName);
    const oldValue = player.data[typeSafeFieldName];
    const newData = { [typeSafeFieldName]: value };

    player.data = Object.assign(player.data, newData);
    await Database.funcs.updatePartialData(player.data._id, newData, Database.collections.Characters);

    if (typeof callbacks[typeSafeFieldName] === 'undefined') {
        return;
    }

    for (let cb of callbacks[typeSafeFieldName]) {
        cb(player, value, oldValue);
    }
}

/**
 * Sets player document values, and saves it automatically to the selected character's database.
 * Automatically calls all callbacks associated with the field name.
 *
 * @template T
 * @param {alt.Player} player
 * @param {(Partial<Character & T>)} fields
 * @returns {void}
 */
async function setBulk<T = {}>(player: alt.Player, fields: Partial<Character & T>) {
    const oldValues = {};

    Object.keys(fields).forEach((key) => {
        oldValues[key] = player.data[key];
    });

    player.data = Object.assign(player.data, fields);
    await Database.funcs.updatePartialData(player.data._id, fields, Database.collections.Characters);

    Object.keys(oldValues).forEach((key) => {
        if (typeof callbacks[key] === 'undefined') {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(player, fields[key], oldValues[key]);
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
function onChange<T = {}>(fieldName: keyof KnownKeys<Character & T>, callback: KeyChangeCallback) {
    const actualFieldName = String(fieldName);

    if (typeof callbacks[actualFieldName] === 'undefined') {
        callbacks[actualFieldName] = [callback];
    } else {
        callbacks[actualFieldName].push(callback);
    }
}

export const CharacterDocument = {
    get,
    getField,
    set,
    setBulk,
    onChange,
};
