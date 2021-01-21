import * as alt from 'alt-server';

/**
 * Sends an emit event to all players with arguments.
 * @export
 * @param {Array<alt.Player>} players Usually alt.Player.all
 * @param {string} eventName The event name you want to emit.
 * @param {...any[]} args The data you want to send.
 */
export function emitAll(players: Array<alt.Player>, eventName: string, ...args: any[]) {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (!player || !player.valid) {
            continue;
        }

        alt.emitClient(player, eventName, ...args);
    }
}
