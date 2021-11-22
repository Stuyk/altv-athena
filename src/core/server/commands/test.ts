import * as alt from 'alt-server';
import { WORLD_NOTIFICATION_TYPE } from '../../shared/enums/WorldNotificationTypes';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { InputMenu, InputOptionType, InputResult } from '../../shared/interfaces/InputMenus';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { WorldNotificationController } from '../systems/worldNotifications';

ChatController.addCommand(
    'testerrorscreen',
    '/testerrorscreen - Shows a temporary error screen',
    PERMISSIONS.ADMIN,
    (player: alt.Player) => {
        playerFuncs.emit.createErrorScreen(player, { duration: 5000, title: 'Test', text: 'Hello World!' });
    },
);

ChatController.addCommand(
    'testworldhelptext',
    '/testworldhelptext - Shows temporary world help text',
    PERMISSIONS.ADMIN,
    (player: alt.Player) => {
        const uid = WorldNotificationController.addToPlayer(player, {
            text: 'Hello World!',
            type: WORLD_NOTIFICATION_TYPE.ARROW_BOTTOM,
            pos: { ...player.pos },
        });

        alt.setTimeout(() => {
            if (!player || !player.valid) {
                return;
            }

            WorldNotificationController.removeFromPlayer(player, uid);
        }, 5000);
    },
);

ChatController.addCommand(
    'testspinner',
    '/testspinner - Shows a temporary spinner',
    PERMISSIONS.ADMIN,
    (player: alt.Player) => {
        playerFuncs.emit.createSpinner(player, { duration: 5000, text: 'Hello World!' });
    },
);

ChatController.addCommand(
    'testshard',
    '/testshard - Shows a temporary shard',
    PERMISSIONS.ADMIN,
    (player: alt.Player) => {
        playerFuncs.emit.createShard(player, {
            duration: 5000,
            title: '~r~Hello World!',
            text: '~y~Shards are pretty neat sometimes.',
        });
    },
);

ChatController.addCommand(
    'testcredits',
    '/testcredits - Shows a temporary credits display',
    PERMISSIONS.ADMIN,
    (player: alt.Player) => {
        playerFuncs.emit.createCredits(player, {
            duration: 5000,
            role: 'Athena Creator',
            name: 'Stuyk',
        });
    },
);

ChatController.addCommand('testinput', '/testinput', PERMISSIONS.ADMIN, (player: alt.Player) => {
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
        ],
        serverEvent: 'cmd:Input:Test',
        generalOptions: {
            submitText: 'Wow Nice Submit',
            cancelText: 'Bad Submit',
            description: 'idk there is some text here now lul',
            skipChecks: false,
        },
    };

    playerFuncs.emit.inputMenu(player, menu);
});

alt.onClient('cmd:Input:Test', (player: alt.Player, results: InputResult[] | null) => {
    if (!results) {
        console.log(`They cancelled the test input.`);
        return;
    }

    console.log(`Results from test input:`);
    console.log(results);
});
