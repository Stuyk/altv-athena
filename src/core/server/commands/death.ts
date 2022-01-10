import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'acceptdeath',
    LocaleController.get(LOCALE_KEYS.COMMAND_ACCEPT_DEATH, '/acceptdeath'),
    PERMISSIONS.NONE,
    handleCommand,
);

ChatController.addCommand(
    'respawn',
    LocaleController.get(LOCALE_KEYS.COMMAND_ACCEPT_DEATH, '/respawn'),
    PERMISSIONS.NONE,
    handleCommand,
);

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
