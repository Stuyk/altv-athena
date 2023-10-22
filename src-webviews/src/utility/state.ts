import { Character } from '@AthenaShared/interfaces/character.js';
import { Account } from '@AthenaShared/interfaces/iAccount.js';

const state: { [key: string]: any } = {};

/**
 * Set state that can be transferred between page instances.
 *
 * @export
 * @param {string} key
 * @param {*} value
 */
export function set(key: string, value: any) {
    state[key] = value;
}

/**
 * Get state by key value.
 *
 * Specify a generic type to automatically transform to that type.
 *
 * @export
 * @template T
 * @param {string} key
 * @return {T}
 */
export function get<T>(key: string): T | undefined {
    return state[key];
}

/**
 * Returns character data when synchronized from server.
 *
 * @export
 * @template T
 * @return {(T | undefined)}
 */
export function getCharacterData<T = Character>(): T | undefined {
    return state['characterState'];
}

/**
 * Returns account state when synchronized from server.
 *
 * @export
 * @template T
 * @return {(T | undefined)}
 */
export function getAccountData<T = Partial<Account>>(): T | undefined {
    return state['accountState'];
}

/**
 * Return a list of character permissions.
 *
 * @export
 * @return {Array<string>}
 */
export function getCharacterPermissions(): Array<string> {
    if (!state['characterState']) {
        return [];
    }

    if (!state['characterState'].permissions) {
        return [];
    }

    return state['characterState'].permissions;
}

/**
 * Return a list of account permissions.
 *
 * @export
 * @return {Array<string>}
 */
export function getAccountPermissions(): Array<string> {
    if (!state['accountState']) {
        return [];
    }

    if (!state['accountState'].permissions) {
        return [];
    }

    return state['accountState'].permissions;
}
