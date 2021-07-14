import * as alt from 'alt-server';

import { playerFuncs } from '../../server/extensions/Player';
import { InteractionController } from '../../server/systems/interaction';
import { Job } from '../../server/systems/job';
import { TextLabelController } from '../../server/systems/textlabel';
import { CurrencyTypes } from '../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { AnimationFlags } from '../../shared/flags/animation';
import JobEnums, { Objective } from '../../shared/interfaces/Job';
import { JobTrigger } from '../../shared/interfaces/JobTrigger';
import { distance2d } from '../../shared/utility/vector';
import { BlipController } from '../../client/systems/blip';

const startPosition = { x: -664.4656372070312, y: -215.07139587402344, z: 37.201847076416016 };
const objectives: Array<Objective> = [
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.WAYPOINT,
        description: `Get to the Jewelry Store`,
        range: 3,
        pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 },
        marker: {
            pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 } as alt.Vector3,
            type: 1,
            color: new alt.RGBA(0, 255, 0, 100)
        },
        textLabel: {
            pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 } as alt.Vector3,
            data: 'Enter the Store'
        },
        blip: {
            pos: { x: -634.3856201171875, y: -239.7871551513672, z: 38.048484802246094 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Jewelry Store',
            scale: 1
        },
        eventCall: {
            eventName: 'started:Heist',
            isServer: true
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.CAPTURE_POINT,
        description: `Smash the Case`,
        range: 3,
        captureMaximum: 3,
        pos: { x: -626.7536010742188, y: -238.54708862304688, z: 38.05705261230469 },
        textLabel: {
            pos: { x: -626.7536010742188, y: -238.54708862304688, z: 38.05705261230469 - 0.5 } as alt.Vector3,
            data: 'Smash the Case'
        },
        blip: {
            pos: { x: -626.7536010742188, y: -238.54708862304688, z: 38.05705261230469 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Case',
            scale: 1
        },
        animation: {
            dict: 'missheist_jewel',
            name: 'smash_case',
            flags: AnimationFlags.NORMAL,
            duration: 4000,
            rotation: { x: 0, y: 0, z: -2.498518466949463 } as alt.Vector3,
            atObjectiveStart: false
        },
        particle: {
            dict: 'core',
            name: 'glass_smash',
            duration: 500,
            pos: { x: -626.2422485351562, y: -238.98475646972656, z: 39.24375534057617 - 0.8 },
            scale: 1
        },
        eventCall: {
            eventName: 'siren:Heist:Start',
            isServer: true
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.CAPTURE_POINT,
        description: `Smash the Case`,
        range: 3,
        captureMaximum: 3,
        pos: { x: -620.2802124023438, y: -234.3983154296875, z: 38.057064056396484 },
        textLabel: {
            pos: { x: -620.2802124023438, y: -234.3983154296875, z: 38.057064056396484 - 0.5 } as alt.Vector3,
            data: 'Smash the Case'
        },
        blip: {
            pos: { x: -620.2802124023438, y: -234.3983154296875, z: 38.057064056396484 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Case',
            scale: 1
        },
        animation: {
            dict: 'missheist_jewel',
            name: 'smash_case',
            flags: AnimationFlags.NORMAL,
            duration: 4000,
            rotation: { x: 0, y: 0, z: -2.78486704826355 } as alt.Vector3,
            atObjectiveStart: false
        },
        particle: {
            dict: 'core',
            name: 'glass_smash',
            duration: 500,
            pos: { x: -620.2802124023438, y: -234.3983154296875, z: 38.057064056396484 },
            scale: 1
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.CAPTURE_POINT,
        description: `Smash the Case`,
        range: 3,
        captureMaximum: 3,
        pos: { x: -617.6484375, y: -230.53868103027344, z: 38.057029724121094 },
        textLabel: {
            pos: { x: -617.6484375, y: -230.53868103027344, z: 38.057029724121094 - 0.5 } as alt.Vector3,
            data: 'Smash the Case'
        },
        blip: {
            pos: { x: -617.6484375, y: -230.53868103027344, z: 38.057029724121094 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Case',
            scale: 1
        },
        animation: {
            dict: 'missheist_jewel',
            name: 'smash_case',
            flags: AnimationFlags.NORMAL,
            duration: 4000,
            rotation: { x: 0, y: 0, z: -0.7960096597671509 } as alt.Vector3,
            atObjectiveStart: false
        },
        particle: {
            dict: 'core',
            name: 'glass_smash',
            duration: 500,
            pos: { x: -617.6484375, y: -230.53868103027344, z: 38.057029724121094 },
            scale: 1
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.CAPTURE_POINT,
        description: `Smash the Case`,
        range: 3,
        captureMaximum: 3,
        pos: { x: -621.1551513671875, y: -228.2981719970703, z: 38.057029724121094 },
        textLabel: {
            pos: { x: -621.1551513671875, y: -228.2981719970703, z: 38.057029724121094 - 0.5 } as alt.Vector3,
            data: 'Smash the Case'
        },
        blip: {
            pos: { x: -621.1551513671875, y: -228.2981719970703, z: 38.057029724121094 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Case',
            scale: 1
        },
        animation: {
            dict: 'missheist_jewel',
            name: 'smash_case',
            flags: AnimationFlags.NORMAL,
            duration: 4000,
            rotation: { x: 0, y: 0, z: 2.2121686935424805 } as alt.Vector3,
            atObjectiveStart: false
        },
        particle: {
            dict: 'core',
            name: 'glass_smash',
            duration: 500,
            pos: { x: -621.1551513671875, y: -228.2981719970703, z: 38.057029724121094 },
            scale: 1
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.CAPTURE_POINT,
        description: `Smash the Case`,
        range: 3,
        captureMaximum: 3,
        pos: { x: -624.979248046875, y: -227.95962524414062, z: 38.057029724121094 },
        textLabel: {
            pos: { x: -624.979248046875, y: -227.95962524414062, z: 38.057029724121094 - 0.5 } as alt.Vector3,
            data: 'Smash the Case'
        },
        blip: {
            pos: { x: -624.979248046875, y: -227.95962524414062, z: 38.057029724121094 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Case',
            scale: 1
        },
        animation: {
            dict: 'missheist_jewel',
            name: 'smash_case',
            flags: AnimationFlags.NORMAL,
            duration: 4000,
            rotation: { x: 0, y: 0, z: 0.49127936363220215 } as alt.Vector3,
            atObjectiveStart: false
        },
        particle: {
            dict: 'core',
            name: 'glass_smash',
            duration: 500,
            pos: { x: -624.979248046875, y: -227.95962524414062, z: 38.057029724121094 },
            scale: 1
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.WAYPOINT,
        description: `Escape out the front door!`,
        range: 3,
        pos: { x: -633.31494140625, y: -239.41348266601562, z: 38.0802116394043 },
        blip: {
            pos: { x: -633.31494140625, y: -239.41348266601562, z: 38.0802116394043 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Escape Point',
            scale: 1
        }
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.WAYPOINT,
        description: `Get to the extraction point!`,
        range: 3,
        pos: { x: -596.7017211914062, y: -306.4066467285156, z: 34.80327606201172 },
        blip: {
            pos: { x: -596.7017211914062, y: -306.4066467285156, z: 34.80327606201172 },
            shortRange: true,
            sprite: 143,
            color: 26,
            text: 'Extraction Point',
            scale: 1
        },
        eventCall: {
            eventName: 'heist:Completed',
            isServer: true
        }
    }
];

alt.on('started:Heist', (player: alt.Player, pos: alt.Vector3) => {
    playerFuncs.emit.notification(player, `You have started the heist.`);
});

alt.on('heist:Completed', (player: alt.Player, pos: alt.Vector3) => {
    const reward = Math.floor(Math.random() * 1000);
    playerFuncs.emit.notification(player, `You have completed the heist.`);
    playerFuncs.emit.notification(player, `~g~+$${reward}`);
    playerFuncs.currency.add(player, CurrencyTypes.CASH, reward);
});

// Interactions for this Heist
TextLabelController.add({ data: 'Jewelry Store Heist', pos: startPosition, maxDistance: 10 });

InteractionController.add({
    callback: handleStartJob,
    type: 'heistjewelrystore',
    position: startPosition
});

function handleStartJob(player: alt.Player) {
    const trigger: JobTrigger = {
        header: 'Rob the Jewelry Store',
        event: 'heist:Start',
        image: 'https://i.imgur.com/Gi887Wk.png',
        summary: `It's time to put up or shutup. Grab your gun and a group of friends because you're about to rob the jewelry store.`
    };

    alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_JOB, trigger);
}

alt.on('heist:Start', (player: alt.Player) => {
    if (distance2d(player.pos, startPosition) > 5) {
        playerFuncs.emit.notification(player, `~r~Too far away...`);
        return;
    }

    const job = new Job();
    job.loadObjectives(objectives);
    job.addPlayer(player);
});
