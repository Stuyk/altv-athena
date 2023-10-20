import * as alt from 'alt-client';
import { PlayerConfigKeys } from '@AthenaShared/enums/playerConfigKeys.js';
import { Account } from '@AthenaShared/interfaces/iAccount.js';
import { Character } from '@AthenaShared/interfaces/character.js';

export type ConfigCallback = (value: any) => void;

const callbacks: { [key: string]: Array<ConfigCallback> } = {};

const InternalFunctions = {
    process(key: string, value: any) {
        if (!callbacks[key]) {
            return;
        }

        for (let cb of callbacks[key]) {
            cb(value);
        }
    },
};

export function get(key: 'character-data'): Character | undefined;
export function get(key: 'account-data'): Account | undefined;
/**
 * Get a value assigned by the server.
 *
 * @template ReturnType
 * @param {string} key
 * @return {(ReturnType | undefined)}
 */
export function get<ReturnType, CustomKeys = PlayerConfigKeys>(key: CustomKeys): ReturnType | undefined {
    return alt.getMeta(String(key)) as ReturnType;
}

/**
 * Add a custom callback to listen for config changes.
 *
 * @template CustomKeys
 * @param {(PlayerConfigKeys | CustomKeys)} key
 * @param {ConfigCallback} callback
 */
export function addCallback<CustomKeys>(key: PlayerConfigKeys | CustomKeys, callback: ConfigCallback) {
    const keyName = String(key);

    if (!callbacks[keyName]) {
        callbacks[keyName] = [];
    }

    callbacks[keyName].push(callback);
}

alt.on('localMetaChange', InternalFunctions.process);
