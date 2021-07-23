import * as alt from 'alt-server';

import { playerFuncs } from '../../server/extensions/Player';
import { BlipController } from '../../server/systems/blip';
import { InteractionController } from '../../server/systems/interaction';
import { Job } from '../../server/systems/job';
import { TextLabelController } from '../../server/systems/textlabel';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import JobEnums, { Objective } from '../../shared/interfaces/Job';
import { JobTrigger } from '../../shared/interfaces/JobTrigger';
import { distance2d } from '../../shared/utility/vector';

const START_EVENT_NAME = 'job:Garbage:Start';
const startPosition = { x: -629.1688842773438, y: -1635.922119140625, z: 25.474937438964844 };
const vehicleSpawn = { x: -615.3775634765625, y: -1588.7281494140625, z: 26.75115203857422 };
const vehicleRotation = { x: 0, y: 0, z: 1.9803931713104248 };
const objectives: Array<Objective> = [];

// {
//     criteria: JobEnums.ObjectiveCriteria.IN_VEHICLE,
//     type: JobEnums.ObjectiveType.WAYPOINT,
//     description: `Get to the Jewelry Store`,
//     range: 3,
//     pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 },
//     marker: {
//         pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 } as alt.Vector3,
//         type: 1,
//         color: new alt.RGBA(0, 255, 0, 100)
//     },
//     textLabel: {
//         pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 } as alt.Vector3,
//         data: 'Enter the Store'
//     },
//     blip: {
//         pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 },
//         shortRange: true,
//         sprite: 143,
//         color: 26,
//         text: 'Jewelry Store',
//         scale: 1
//     },
//     eventCall: {
//         eventName: 'started:Heist',
//         isServer: true
//     }
// }

alt.on('started:Heist', (player: alt.Player, pos: alt.Vector3) => {
    playerFuncs.emit.notification(player, `Your route has been updated. Please follow your GPS.`);
});

// alt.on('heist:Completed', (player: alt.Player, pos: alt.Vector3) => {
//     const reward = Math.floor(Math.random() * 1000);
//     playerFuncs.emit.notification(player, `You have completed the heist.`);
//     playerFuncs.emit.notification(player, `~g~+$${reward}`);
//     playerFuncs.currency.add(player, CurrencyTypes.CASH, reward);
// });

TextLabelController.add({
    data: 'Garbage Collection Job',
    pos: startPosition,
    maxDistance: 10
});

BlipController.add({
    text: 'Garbage Collection Job',
    scale: 1,
    pos: startPosition,
    color: 8,
    sprite: 318,
    shortRange: true
});

InteractionController.add({
    type: 'job-garbage-collection',
    position: startPosition,
    callback: (player: alt.Player) => {
        const trigger: JobTrigger = {
            header: 'Run a Garbage Route',
            event: START_EVENT_NAME,
            image: 'https://i.imgur.com/Gi887Wk.png',
            summary: `Pick up that can. Actually pick up all the cans.`
        };

        alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_JOB, trigger);
    }
});

alt.on(START_EVENT_NAME, (player: alt.Player) => {
    if (distance2d(player.pos, startPosition) > 5) {
        playerFuncs.emit.notification(player, `~r~Too far away...`);
        return;
    }

    const job = new Job();
    job.loadObjectives(objectives);
    job.addPlayer(player);
});
