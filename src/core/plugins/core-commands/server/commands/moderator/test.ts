import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PedController } from '../../../../../server/streamers/ped';
import { WorldNotificationController } from '../../../../../server/streamers/worldNotifications';
import { SYSTEM_EVENTS } from '../../../../../shared/enums/system';
import { WORLD_NOTIFICATION_TYPE } from '../../../../../shared/enums/worldNotificationTypes';
import { ANIMATION_FLAGS } from '../../../../../shared/flags/animationFlags';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { Action } from '../../../../../shared/interfaces/actions';
import { Animation } from '../../../../../shared/interfaces/animation';
import IAttachable from '../../../../../shared/interfaces/iAttachable';
import { InputMenu, InputOptionType, InputResult } from '../../../../../shared/interfaces/inputMenus';
import { IPed } from '../../../../../shared/interfaces/iPed';
import { JobTrigger } from '../../../../../shared/interfaces/jobTrigger';

class TestCommands {
    @command('testerrorscreen', '/testerrorscreen - Shows a temporary error screen', PERMISSIONS.ADMIN)
    private static testErrorScreen(player: alt.Player) {
        Athena.player.emit.createErrorScreen(player, { duration: 5000, title: 'Test', text: 'Hello World!' });
    }

    @command('testworldhelptext', '/testworldhelptext - Shows temporary world help text', PERMISSIONS.ADMIN)
    private static testWorldHelpTextComamnd(player: alt.Player) {
        const uid = WorldNotificationController.addToPlayer(player, {
            text: 'Hello World!',
            type: WORLD_NOTIFICATION_TYPE.ARROW_BOTTOM,
            pos: { ...player.pos },
        });

        alt.setTimeout(() => {
            if (!player || !player.valid) return;
            WorldNotificationController.removeFromPlayer(player, uid);
        }, 5000);
    }

    @command('testspinner', '/testspinner - Shows a temporary spinner', PERMISSIONS.ADMIN)
    private static testSpinnerCommand(player: alt.Player) {
        Athena.player.emit.createSpinner(player, { duration: 5000, text: 'Hello World!' });
    }

    @command('testshard', '/testshard - Shows a temporary shard', PERMISSIONS.ADMIN)
    private static testShardCommand(player: alt.Player) {
        Athena.player.emit.createShard(player, {
            duration: 5000,
            title: '~r~Hello World!',
            text: '~y~Shards are pretty neat sometimes.',
        });
    }

    @command('testcredits', '/testcredits - Shows a temporary credits display', PERMISSIONS.ADMIN)
    private static testCreditsCommand(player: alt.Player) {
        Athena.player.emit.createCredits(player, {
            duration: 5000,
            role: 'Athena Creator',
            name: 'Stuyk',
        });
    }

    @command('testinput', '/testinput', PERMISSIONS.ADMIN)
    private static testInputCommand(player: alt.Player) {
        const menu: InputMenu = {
            title: 'Input Test',
            options: [
                {
                    id: 'some-name',
                    desc: 'Write something...',
                    placeholder: 'Property Name',
                    type: InputOptionType.TEXT,
                    error: 'Must specify property name.',
                },
                {
                    id: 'some-number',
                    desc: 'Some kind of number...',
                    placeholder: '5000...',
                    type: InputOptionType.NUMBER,
                    error: 'Must specify property value.',
                },
                {
                    id: 'randomize',
                    desc: 'Should this peds apperance be randomized?',
                    placeholder: '',
                    type: InputOptionType.CHOICE,
                    error: '',
                    choices: [
                        { text: 'Yes', value: 'true' },
                        { text: 'No', value: 'false' },
                    ],
                },
                {
                    id: 'textlabel',
                    desc: 'Should this ped have an Textlabel?',
                    placeholder: '',
                    type: InputOptionType.CHOICE,
                    error: '',
                    choices: [
                        { text: 'Yes', value: 'true' },
                        { text: 'No', value: 'false' },
                    ],
                },
            ],
            serverEvent: 'cmd:Input:Test',
            generalOptions: {
                submitText: 'Wow Nice Submit',
                cancelText: 'Bad Submit',
                description: 'idk there is some text here now lul',
                skipChecks: false,
            },
        };

        Athena.player.emit.inputMenu(player, menu);
    }

    @command('testobjectattach', '/testobjectattach - Test object attachment', PERMISSIONS.ADMIN)
    private static testObjectAttachCommand(player: alt.Player) {
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

        Athena.player.emit.objectAttach(player, attachable, 5000);
    }

    @command('testobjectattachinfinite', '/testobjectattachinfinite - Test object attachment', PERMISSIONS.ADMIN)
    private static testObjectAttachInfiniteCommand(player: alt.Player) {
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
    }

    @command('testjobmenu', '/testjobmenu - Shows a test job menu', PERMISSIONS.ADMIN)
    private static testJobMenuCommand(player: alt.Player) {
        const trigger: JobTrigger = {
            header: 'My Job Header',
            event: 'job:Example:Response',
            image: '../../assets/images/job.jpg',
            summary: `<b>Hey Listen!</b>
            
                <p>Isn't it neat that you can write whatever you want here?</p>

                <p>I sure think so!</p>
            `,
        };

        alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_JOB, trigger);
    }

    @command('testped', '/testped - A Test Ped. Does not delete itself', PERMISSIONS.ADMIN)
    private static testPedCommand(player: alt.Player) {
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

        PedController.append(ped);
    }

    @command('testactionmenu', '/testactionmenu - A test action menu', PERMISSIONS.ADMIN)
    private static testActionMenuCommand(player: alt.Player) {
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

        // Create the menu and send it to the player/
        Athena.player.set.actionMenu(
            player,
            // The Menu
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
    }
}

alt.onClient('cmd:Input:Test', (_player: alt.Player, results: InputResult[] | null) => {
    if (!results) {
        console.log(`They cancelled the test input.`);
        return;
    }

    console.log(`Results from test input:`);
    console.log(results);
});

alt.on('job:Example:Response', (player: alt.Player) => {
    Athena.player.emit.message(player, `Accepted 'job:Example:Response'`);
});

alt.onClient('hello:From:Client', (player) => {
    Athena.player.emit.message(player, `Got menu option from client.`);
});

alt.onClient('animation:Action:Server', (player, data: Animation) => {
    if (!data) return;

    Athena.player.emit.animation(player, data.dict, data.name, data.flags, data.duration);
});
