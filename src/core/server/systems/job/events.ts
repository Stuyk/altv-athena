import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { ObjectiveEvents } from '@AthenaShared/interfaces/job';

export function handleJobAction(player: alt.Player, triggerName: string) {
    alt.emit(triggerName, player);
}

export function handleVerify(player: alt.Player) {
    const instance = Athena.systems.job.instance.get(player);

    if (!instance) {
        const data = Athena.document.character.get(this.player);
        alt.log(`${data.name} has a dead job instance.`);
        alt.emitClient(player, ObjectiveEvents.JOB_SYNC, null);
        return;
    }

    alt.setTimeout(() => {
        Athena.systems.job.verify.objective(instance);
    }, 0);
}

alt.onClient(ObjectiveEvents.JOB_VERIFY, handleVerify);
alt.onClient(SYSTEM_EVENTS.INTERACTION_JOB_ACTION, handleJobAction);
