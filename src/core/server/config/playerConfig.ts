import * as alt from 'alt-server';
import { PlayerConfigKeys } from '@AthenaShared/enums/playerConfigKeys.js';

/**
 * Set a value to auto-sync to client.
 * Provides type safety for setting predictable keys.
 * Wraps up the player.setLocalMeta function.
 *
 * #### Example
 * ```ts
 * export type ExtendedKeys = 'hello-world' | 'wanted-level' | 'bitcoins';
 *
 * Athena.config.set<ExtendedKeys>('wanted-level', 5);
 * ```
 *
 * @template CustomKeys
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(PlayerConfigKeys | CustomKeys)} key
 * @param {*} value
 */
export function set<CustomKeys>(player: alt.Player, key: PlayerConfigKeys | CustomKeys, value: any): void {
    player.setLocalMeta(String(key), value);
}

export default { set };
