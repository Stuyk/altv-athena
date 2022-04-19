import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { Athena } from '../api/athena';
import { command } from '../decorators/commands';

class Death {
    @command(['acceptdeath', 'respawn'], '/acceptdeath - Accept death.', PERMISSIONS.NONE)
    static handleCommand(player: alt.Player): void {
        if (!player || !player.valid) {
            return;
        }

        if (!player.data.isDead) {
            return;
        }

        if (Date.now() < player.nextDeathSpawn) {
            return;
        }

        Athena.player.set.respawned(player, null);
    }
}
