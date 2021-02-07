import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import ChatController from '../../server/systems/chat';
import { InteractionController } from '../../server/systems/interaction';
import { Job } from '../../server/systems/job';
import { AnimationFlags } from '../../shared/flags/animation';
import { Permissions } from '../../shared/flags/permissions';
import JobEnums, { Objective } from '../../shared/interfaces/Job';
import { deepCloneObject } from '../../shared/utility/deepCopy';

const objectives: Array<Objective> = [
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.WAYPOINT,
        description: 'Walk to the marker',
        pos: { x: -241.42921447753906, y: -713.875244140625, z: 33.49561309814453 },
        marker: {
            pos: { x: -241.42921447753906, y: -713.875244140625, z: 33.49561309814453 - 1 } as alt.Vector3,
            color: { r: 255, g: 255, b: 255, a: 100 },
            type: 1
        },
        blip: {
            pos: { x: -241.42921447753906, y: -713.875244140625, z: 33.49561309814453 },
            shortRange: false,
            sprite: 143,
            color: 26,
            text: 'Objective Point',
            scale: 0.1
        },
        particle: {
            pos: { x: -241.42921447753906, y: -713.875244140625, z: 33.49561309814453 },
            dict: 'core',
            name: 'blood_chopper',
            duration: 5000,
            scale: 5
        },
        animation: {
            dict: 'anim@mp_player_intcelebrationfemale@air_guitar',
            name: 'air_guitar',
            duration: 2000,
            flags: AnimationFlags.NORMAL,
            atObjectiveStart: true,
            rotation: { x: 0, y: 0, z: 1.879676103591919 } as alt.Vector3
        },
        range: 2
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.WAYPOINT,
        description: 'Walk to the next marker',
        pos: { x: -240.16085815429688, y: -724.7368774414062, z: 33.50142288208008 },
        marker: {
            pos: { x: -240.16085815429688, y: -724.7368774414062, z: 33.50142288208008 - 1 } as alt.Vector3,
            color: { r: 255, g: 255, b: 255, a: 100 },
            type: 1
        },
        blip: {
            pos: { x: -240.16085815429688, y: -724.7368774414062, z: 33.50142288208008 },
            shortRange: false,
            sprite: 143,
            color: 26,
            text: 'Objective Point',
            scale: 0.1
        },
        particle: {
            pos: { x: -240.16085815429688, y: -724.7368774414062, z: 33.50142288208008 },
            dict: 'core',
            name: 'exp_grd_plane_sp',
            duration: 5000,
            scale: 5
        },
        range: 2
    },
    {
        criteria: JobEnums.ObjectiveCriteria.NO_VEHICLE,
        type: JobEnums.ObjectiveType.WAYPOINT,
        description: 'Walk to the last marker',
        pos: { x: -231.2491912841797, y: -718.907958984375, z: 33.50018310546875 },
        marker: {
            pos: { x: -231.2491912841797, y: -718.907958984375, z: 33.50018310546875 - 1 } as alt.Vector3,
            color: { r: 255, g: 255, b: 255, a: 100 },
            type: 1
        },
        textLabel: {
            pos: { x: -231.2491912841797, y: -718.907958984375, z: 33.50018310546875 + 1 },
            data: `The last object!~n~~r~NICE!`
        },
        blip: {
            pos: { x: -231.2491912841797, y: -718.907958984375, z: 33.50018310546875 - 1 },
            shortRange: false,
            sprite: 143,
            color: 26,
            text: 'Objective Point',
            scale: 0.1
        },
        particle: {
            pos: { x: -231.2491912841797, y: -718.907958984375, z: 33.50018310546875 },
            dict: 'core',
            name: 'ent_dst_wood_splinter',
            duration: 5000,
            scale: 5
        },
        range: 2
    }
];

InteractionController.addInteraction(
    'pizzajob1',
    { x: -247.4142303466797, y: -701.3204345703125, z: 33.55748748779297 } as alt.Vector3,
    3,
    'Start the pizza job',
    {
        sprite: 84,
        text: 'Pizza Jerb',
        pos: { x: -247.25341796875, y: -700.78076171875, z: 33.55743408203125 },
        shortRange: true,
        color: 5,
        scale: 0.2
    },
    true
);

alt.on('pizzajob1', (player: alt.Player, position: alt.Vector3) => {
    const jobInstance = new Job();
    jobInstance.loadObjectives(deepCloneObject(objectives));
    jobInstance.addPlayer(player);
});
