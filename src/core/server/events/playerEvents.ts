import * as alt from 'alt-server';

type AthenaPlayerEvents =
    | 'drop-item'
    | 'increased-play-time'
    | 'item-equipped'
    | 'item-unequipped'
    | 'player-died'
    | 'player-uniform-set'
    | 'player-uniform-cleared'
    | 'player-skin-set'
    | 'player-skin-cleared'
    | 'player-health-set'
    | 'player-armour-set'
    | 'player-pos-set'
    | 'pickup-item'
    | 'respawned'
    | 'selected-character'
    | 'set-account-data'
    | 'spawned';

type PlayerCallbackArgs = (player: alt.Player, ...args: any[]) => void;

const playerEvents: Array<{ eventName: string; callback: (player: alt.Player, ...args: any[]) => void }> = [];

export class PlayerEvents {
    /**
     * Usually called by internal functions. Can be used to manually trigger an Athena Event though.
     * @static
     * @param {AthenaPlayerEvents} eventName
     * @param {alt.Player} player
     * @memberof PlayerEvents
     */
    static trigger<CustomEvents>(eventName: AthenaPlayerEvents & CustomEvents, player: alt.Player, ...args: any[]) {
        for (let i = 0; i < playerEvents.length; i++) {
            if (playerEvents[i].eventName !== eventName) {
                continue;
            }

            playerEvents[i].callback(player, ...args);
        }
    }

    /**
     * Trigger a callback specific to Athena Player Events.
     * @static
     * @param {AthenaPlayerEvents} eventName
     * @param {(player: alt.Player) => void} callback
     * @memberof PlayerEvents
     */

    static on<CustomEvents>(eventName: AthenaPlayerEvents & CustomEvents, callback: PlayerCallbackArgs) {
        playerEvents.push({ eventName, callback });
    }
}
