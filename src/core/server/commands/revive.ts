import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { Athena } from '../api/athena';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'revive',
    LocaleController.get(LOCALE_KEYS.COMMAND_REVIVE, '/revive'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player, id: string | null = null): void {
    if (id === null || id === undefined) {
        Athena.player.set.respawned(player, player.pos);
        return;
    }

    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    Athena.player.set.respawned(target, target.pos);
}
