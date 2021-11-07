import * as alt from 'alt-server';
import { WORLD_NOTIFICATION_TYPE } from '../../shared/enums/WorldNotificationTypes';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
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
