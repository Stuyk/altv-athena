import * as alt from 'alt-server';
import { Job } from './system';

const JobInstances: { [key: string]: Job } = {};

/**
 * Get the current job instance for a player, or player id.
 *
 * @export
 * @param {(number | alt.Player)} player
 * @return {(Job | undefined)}
 */
export function get(player: number | alt.Player): Job | undefined {
    if (player instanceof alt.Player) {
        return JobInstances[player.id];
    }

    return JobInstances[player];
}

/**
 * Set the current job instance for a player.
 *
 * @export
 * @param {alt.Player} player
 * @param {Job} newJob
 */
export function set(player: alt.Player, newJob: Job) {
    const job = get(player);
    if (typeof job !== 'undefined') {
        job.quit('Switched Job');
    }

    JobInstances[player.id] = newJob;
}

/**
 * Clear the job instance.
 *
 * @export
 * @param {(number | alt.Player)} player
 * @return {*}
 */
export function clear(player: number | alt.Player) {
    if (player instanceof alt.Player) {
        delete JobInstances[player.id];
        return;
    }

    delete JobInstances[player];
}

alt.on('playerDisconnect', (player: alt.Player) => {
    const id = player.id;
    JobInstances[id].quit('Disconnected');
    clear(id);
});
