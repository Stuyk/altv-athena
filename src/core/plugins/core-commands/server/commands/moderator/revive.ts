import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class ReviveCommand {
    @command('revive', LocaleController.get(LOCALE_KEYS.COMMAND_REVIVE, '/revive'), PERMISSIONS.ADMIN)
    private static handleCommand(player: alt.Player, id: string | null = null): void {
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
}
