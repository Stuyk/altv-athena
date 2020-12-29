import * as alt from 'alt-server';

export function emitAll(players: Array<alt.Player>, eventName: string, ...args: any[]) {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (!player || !player.valid) {
            continue;
        }

        player.emit(eventName, ...args);
    }
}
