import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { command } from '../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { DeathSystem } from './death';

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

    @command(
        ['acceptdeath', 'respawn'],
        LocaleController.get(LOCALE_KEYS.COMMAND_ACCEPT_DEATH, '/acceptdeath'),
        PERMISSIONS.NONE,
    )
    static handleCommand(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        if (!player.data.isDead) {
            return;
        }

        const timeInFuture = DeathSystem.getRespawnTime(player);
        if (typeof timeInFuture === 'undefined') {
            return;
        }

        if (Date.now() < timeInFuture) {
            return;
        }

        Athena.player.set.respawned(player, player.pos);
    }
}
