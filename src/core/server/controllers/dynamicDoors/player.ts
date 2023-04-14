import * as alt from 'alt-server';

const playerLoadingInstance: { [id: string]: boolean } = {};

/**
 * Unregister a player that is loading.
 *
 * @param {alt.Player} player
 */
export function unregister(player: alt.Player) {
    delete playerLoadingInstance[player.id];
}

/**
 * Register a player to start loading a door.
 *
 * @export
 * @param {alt.Player} player
 */
export function register(player: alt.Player) {
    playerLoadingInstance[player.id] = true;
}

/**
 * Check if a player is loading a door currently.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function isLoading(player: alt.Player) {
    return playerLoadingInstance[player.id] ? true : false;
}

alt.on('playerDisconnect', unregister);
