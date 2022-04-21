import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

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
