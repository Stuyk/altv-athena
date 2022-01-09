import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';

const playerEvents: Array<{ eventName: string; callback: (player: alt.Player, ...args: any[]) => void }> = [];

export class PlayerEvents {
    /**
     * Usually called by internal functions. Can be used to manually trigger an Athena Event though.
     * @static
     * @param {ATHENA_EVENTS_PLAYER} eventName
     * @param {alt.Player} player
     * @memberof PlayerEvents
     */
    static trigger(eventName: ATHENA_EVENTS_PLAYER, player: alt.Player, ...args: any[]) {
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
     * @param {ATHENA_EVENTS_PLAYER} eventName
     * @param {(player: alt.Player) => void} callback
     * @memberof PlayerEvents
     */
    static on(eventName: ATHENA_EVENTS_PLAYER, callback: (player: alt.Player, ...args: any[]) => void) {
        playerEvents.push({ eventName, callback });
    }
}
