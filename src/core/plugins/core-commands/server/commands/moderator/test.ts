import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { WORLD_NOTIFICATION_TYPE } from '@AthenaShared/enums/worldNotificationTypes';
import { ANIMATION_FLAGS } from '@AthenaShared/flags/animationFlags';
import { Action } from '@AthenaShared/interfaces/actions';
import { Animation } from '@AthenaShared/interfaces/animation';
import IAttachable from '@AthenaShared/interfaces/iAttachable';
import { PedBone } from '@AthenaShared/enums/boneIds';
import { IPed } from '@AthenaShared/interfaces/iPed';
import { JobTrigger } from '@AthenaShared/interfaces/jobTrigger';

Athena.systems.messenger.commands.register(
    'timecycle',
    '/timecycle [name]',
    ['admin'],
    async (player: alt.Player, name: string | undefined) => {
        if (!name) {
            return;
        }

        Athena.player.emit.setTimeCycleEffect(player, String(name), 5000);
    },
);

Athena.systems.messenger.commands.register(
    'cleartimecycle',
    '/cleartimecycle',
    ['admin'],
    async (player: alt.Player) => {
        Athena.player.emit.clearTimeCycleEffect(player);
    },
);

Athena.systems.messenger.commands.register(
    'vehHash',
    '/vehHash',
    ['admin'],
    async (player: alt.Player, hash: string) => {
        let model = Athena.utility.hashLookup.vehicle.hash(parseInt(hash));
        Athena.player.emit.message(player, model.displayName);
    },
);

Athena.systems.messenger.commands.register(
    'pedHash',
    '/pedHash',
    ['admin'],
    async (player: alt.Player, hash: string) => {
        let model = Athena.utility.hashLookup.ped.hash(parseInt(hash));
        Athena.player.emit.message(player, model.name);
    },
);

Athena.systems.messenger.commands.register(
    'propHash',
    '/propHash',
    ['admin'],
    async (player: alt.Player, hash: string) => {
        let model = Athena.utility.hashLookup.prop.hash(parseInt(hash));
        Athena.player.emit.message(player, model.name);
    },
);

Athena.systems.messenger.commands.register(
    'testerrorscreen',
    '/testerrorscreen - Shows a temporary error screen',
    ['admin'],
    (player: alt.Player) => {
        Athena.player.emit.createErrorScreen(player, { duration: 5000, title: 'Test', text: 'Hello World!' });
    },
);

Athena.systems.messenger.commands.register(
    'testworldhelptext',
    '/testworldhelptext - Shows temporary world help text',
    ['admin'],
    (player: alt.Player) => {
        const uid = Athena.controllers.worldNotification.addToPlayer(player, {
            text: 'Hello World!',
            type: WORLD_NOTIFICATION_TYPE.ARROW_BOTTOM,
            pos: { ...player.pos },
        });

        alt.setTimeout(() => {
            if (!player || !player.valid) return;
            Athena.controllers.worldNotification.removeFromPlayer(player, uid);
        }, 5000);
    },
);

Athena.systems.messenger.commands.register(
    'testspinner',
    '/testspinner - Shows a temporary spinner',
    ['admin'],
    (player: alt.Player) => {
        Athena.player.emit.createSpinner(player, { duration: 5000, text: 'Hello World!' });
    },
);

Athena.systems.messenger.commands.register(
    'testshard',
    '/testshard - Shows a temporary shard',
    ['admin'],
    (player: alt.Player) => {
        Athena.player.emit.createShard(player, {
            duration: 5000,
            title: '~r~Hello World!',
            text: '~y~Shards are pretty neat sometimes.',
        });
    },
);

Athena.systems.messenger.commands.register(
    'testcredits',
    '/testcredits - Shows a temporary credits display',
    ['admin'],
    (player: alt.Player) => {
        Athena.player.emit.createCredits(player, {
            duration: 5000,
            role: 'Athena Creator',
            name: 'Stuyk',
        });
    },
);

Athena.systems.messenger.commands.register(
    'testobjectattach',
    '/testobjectattach - Test object attachment',
    ['admin'],
    (player: alt.Player) => {
        const attachable: IAttachable = {
            model: 'prop_tool_fireaxe',
            bone: PedBone.SKEL_R_Hand,
            pos: {
                x: 0.1,
                y: -0.1,
                z: -0.02,
            },
            rot: {
                x: 80,
                y: 0,
                z: 170,
            },
        };

        Athena.player.emit.objectAttach(player, attachable, 5000);
    },
);

Athena.systems.messenger.commands.register(
    'testobjectattachinfinite',
    '/testobjectattachinfinite - Test object attachment',
    ['admin'],
    (player: alt.Player) => {
        Athena.player.emit.message(player, `Will last for about 5 minutes~`);

        const attachable: IAttachable = {
            model: 'prop_tool_fireaxe',
            bone: 57005,
            pos: {
                x: 0.1,
                y: -0.1,
                z: -0.02,
            },
            rot: {
                x: 80,
                y: 0,
                z: 170,
            },
        };

        Athena.player.emit.objectAttach(player, attachable, 60000 * 5);
    },
);

Athena.systems.messenger.commands.register(
    'testjobmenu',
    '/testjobmenu - Shows a test job menu',
    ['admin'],
    (player: alt.Player) => {
        const trigger: JobTrigger = {
            header: 'My Job Header',
            event: 'job:Example:Response',
            image: '../../assets/images/job.jpg',
            summary: `<b>Hey Listen!</b>
            
                <p>Isn't it neat that you can write whatever you want here?</p>
            
                <p>I sure think so!</p>
            `,
            acceptCallback: (player: alt.Player) => {
                Athena.player.emit.message(player, `You accepted!`);
            },
            cancelCallback: (player: alt.Player) => {
                Athena.player.emit.message(player, `You declined!`);
            },
        };

        Athena.systems.jobTrigger.create(player, trigger);
    },
);

Athena.systems.messenger.commands.register(
    'testped',
    '/testped - A Test Ped. Does not delete itself',
    ['admin'],
    (player: alt.Player) => {
        const anim1: Animation = {
            dict: 'random@arrests@busted',
            name: 'idle_a',
            flags: ANIMATION_FLAGS.REPEAT | ANIMATION_FLAGS.UPPERBODY_ONLY,
            duration: -1,
        };

        const anim2: Animation = {
            dict: 'random@arrests',
            name: 'idle_2_hands_up',
            flags: ANIMATION_FLAGS.NORMAL | ANIMATION_FLAGS.STOP_LAST_FRAME,
            duration: -1,
        };

        const ped: IPed = {
            uid: `ped-${Math.floor(Math.random() * 500000)}`,
            model: 'u_f_m_casinocash_01',
            pos: {
                x: player.pos.x,
                y: player.pos.y,
                z: player.pos.z - 1,
            },
            animations: [anim1, anim2],
        };

        Athena.controllers.staticPed.append(ped);
    },
);

Athena.systems.messenger.commands.register(
    'testactionmenu',
    '/testactionmenu - A test action menu',
    ['admin'],
    (player: alt.Player) => {
        // Create an action called facePalm that uses the Animation Interface.

        const facePalm: Action = {
            eventName: 'animation:Action:Server',
            isServer: true,
            data: {
                dict: 'anim@mp_player_intupperface_palm',
                name: 'idle_a',
                duration: 3000,
                flags: ANIMATION_FLAGS.UPPERBODY_ONLY,
            },
        };

        // Create an action called gangSign that uses the Animation Interface.
        const gangSign: Action = {
            eventName: 'animation:Action:Server',
            isServer: true,
            data: {
                dict: 'mp_player_int_uppergang_sign_a',
                name: 'mp_player_int_gang_sign_a',
                duration: 3000,
                flags: ANIMATION_FLAGS.UPPERBODY_ONLY,
            },
        };

        Athena.player.set.actionMenu(
            player,
            // The menu
            {
                // Option 1 in the menu is a single event.
                'Option 1': {
                    eventName: 'hello:From:Client',
                    isServer: true,
                },

                // Animations in the menu contains 2 more events. You can also add another menu.
                Animations: {
                    'Face Palm': facePalm,
                    'Gang Sign': gangSign,
                    // Creates a menu in the menu.
                    'More Animations': {
                        'Face Palm 2': facePalm, // Just using the same one for testing purposes
                        'Gang Sign 2': gangSign,
                        // Creates a menu in the menu in the menu
                        'More More Animations': {
                            'Face Palm 3': facePalm, // Just using the same one for testing purposes
                            'Gang Sign 3': gangSign,
                            // etc...
                        },
                    },
                },
            },
        );
    },
);

alt.onClient('hello:From:Client', (player) => {
    Athena.player.emit.message(player, `Got menu option from client.`);
});

alt.onClient('animation:Action:Server', (player, data: Animation) => {
    if (!data) return;

    Athena.player.emit.animation(player, data.dict, data.name, data.flags, data.duration);
});
