import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER_CLIENT } from '../../shared/enums/athenaEvents.js';

const clientEvents: Array<{ eventName: string; callback: (player: alt.Player, ...args: any[]) => void }> = [];

export function trigger(eventName: ATHENA_EVENTS_PLAYER_CLIENT, player: alt.Player, ...args: any[]) {
    for (let i = 0; i < clientEvents.length; i++) {
        if (clientEvents[i].eventName !== eventName) {
            continue;
        }

        clientEvents[i].callback(player, ...args);
    }
}

/**
 * Trigger a callback specific to Athena Player Events.
 * @static
 * @param {ATHENA_EVENTS_PLAYER} eventName
 * @param {(player: alt.Player) => void} callback
 *
 */
export function on(eventName: ATHENA_EVENTS_PLAYER_CLIENT, callback: (player: alt.Player, ...args: any[]) => void) {
    clientEvents.push({ eventName, callback });
}
