import * as alt from 'alt-server';
import { PlayerConfigKeys } from '@AthenaShared/enums/playerConfigKeys';

export const PlayerConfig = {
    /**
     * Set a value to auto-sync to client.
     * Provides type safety for setting predictable keys.
     * Wraps up the player.setLocalMeta function.
     *
     * @template ReturnType
     * @param {string} key
     * @return {(ReturnType | undefined)}
     */
    set<CustomKeys>(player: alt.Player, key: PlayerConfigKeys | CustomKeys, value: any): void {
        player.setLocalMeta(String(key), value);
    },
};
