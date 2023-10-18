import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import { ObjectiveEvents } from '@AthenaShared/interfaces/job.js';

let isVerifying: { [key: string]: boolean } = {};

async function invokeObjectiveCheck(player: alt.Player) {
    if (Overrides.invokeObjectiveCheck) {
        return Overrides.invokeObjectiveCheck(player);
    }

    if (!player || !player.valid) {
        return;
    }

    const instance = Athena.systems.job.instance.get(player);

    if (!instance) {
        const data = Athena.document.character.get(this.player);
        alt.log(`${data.name} has a dead job instance.`);
        alt.emitClient(player, ObjectiveEvents.JOB_SYNC, null);
        return;
    }

    if (isVerifying[player.id]) {
        return;
    }

    isVerifying[player.id] = true;
    await Athena.systems.job.verify.objective(instance);
    isVerifying[player.id] = false;
    delete isVerifying[player.id];
}

alt.onClient(ObjectiveEvents.JOB_VERIFY, invokeObjectiveCheck);
alt.on('playerDisconnect', (player: alt.Player) => {
    const id = player.id;
    if (typeof id === 'undefined' || id === null) {
        return;
    }

    delete isVerifying[player.id];
});

interface JobEventFuncs {
    invokeObjectiveCheck: typeof invokeObjectiveCheck;
}

const Overrides: Partial<JobEventFuncs> = {};

export function override(functionName: 'invokeObjectiveCheck', callback: typeof invokeObjectiveCheck);
/**
 * Used to override job objective checking functionality
 *
 *
 * @param {keyof JobEventFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobEventFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
