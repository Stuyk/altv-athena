import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'revive',
    LocaleController.get(LOCALE_KEYS.COMMAND_REVIVE, '/revive'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player, id: string | null = null): void {
    if (id === null || id === undefined) {
        playerFuncs.set.respawned(player, player.pos);
        return;
    }

    const target = playerFuncs.get.findByUid(id);
    if (!target) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    playerFuncs.set.respawned(target, target.pos);
}
