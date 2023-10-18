import * as alt from 'alt-server';
import { Job } from './system.js';

const JobInstances: { [key: string]: Job } = {};

/**
 * Get the current job instance for a player, or player id.
 *
 *
 * @param {(number | alt.Player)} player
 * @return {(Job | undefined)}
 */
export function get(player: number | alt.Player): Job | undefined {
    if (Overrides.get) {
        return Overrides.get(player);
    }

    if (player instanceof alt.Player) {
        return JobInstances[player.id];
    }

    return JobInstances[player];
}

/**
 * Set the current job instance for a player.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Job} newJob
 */
export function set(player: alt.Player, newJob: Job) {
    if (Overrides.set) {
        return Overrides.set(player, newJob);
    }

    const job = get(player);
    if (typeof job !== 'undefined') {
        job.quit('Switched Job');
    }

    JobInstances[player.id] = newJob;
}

/**
 * Clear the job instance.
 *
 *
 * @param {(number | alt.Player)} player
 * @return {void}
 */
export function clear(player: number | alt.Player) {
    if (Overrides.clear) {
        return Overrides.clear(player);
    }

    if (player instanceof alt.Player) {
        delete JobInstances[player.id];
        return;
    }

    delete JobInstances[player];
}

alt.on('playerDisconnect', (player: alt.Player) => {
    const id = player.id;

    if (!JobInstances[id]) {
        return;
    }

    JobInstances[id].quit('Disconnected');
    clear(id);
});

interface JobInstanceFuncs {
    get: typeof get;
    set: typeof set;
    clear: typeof clear;
}

const Overrides: Partial<JobInstanceFuncs> = {};

export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'set', callback: typeof set);
export function override(functionName: 'clear', callback: typeof clear);
/**
 * Used to override job instancing functionality
 *
 *
 * @param {keyof JobInstanceFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobInstanceFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
