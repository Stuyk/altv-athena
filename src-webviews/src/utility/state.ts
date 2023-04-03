import { Character } from '@AthenaShared/interfaces/character';

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
 * @return {*}  {(T | undefined)}
 */
export function getCharacterData<T = Character>(): T | undefined {
    return state['data'];
}
