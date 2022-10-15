import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { command } from '@AthenaServer/decorators/commands';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

export class DeathCommands {
    static init() {
        alt.log(`Death Commands Loaded`);
    }

    @command('revive', LocaleController.get(LOCALE_KEYS.COMMAND_REVIVE, '/revive'), PERMISSIONS.ADMIN)
    private static handleRevive(player: alt.Player, id: string | null = null): void {
        if (id === null || id === undefined) {
            if (!player.data.isDead) {
                return;
            }

            Athena.player.set.respawned(player, player.pos);
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }

        if (!target.data.isDead) {
            return;
        }

        Athena.player.set.respawned(target, target.pos);
    }
}
