import * as alt from 'alt-server';
import { Permissions } from 'core/shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'acceptdeath',
    '/acceptdeath - Will respawn you if you are fully dead.',
    Permissions.None,
    handleCommand
);

ChatController.addAliases('acceptdeath', ['respawn']);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid) {
        return;
    }

    if (!player.data.isDead) {
        return;
    }

    if (Date.now() < player.nextDeathSpawn) {
        return;
    }

    playerFuncs.set.respawned(player, null);
}
