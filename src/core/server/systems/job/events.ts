import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { ObjectiveEvents } from '@AthenaShared/interfaces/job';

let isVerifying: { [key: string]: boolean } = {};

async function invokeObjectiveCheck(player: alt.Player) {
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
