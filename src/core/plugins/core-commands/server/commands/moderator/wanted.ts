import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { command } from '@AthenaServer/decorators/commands';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

class WantedCommand {
    @command('wanted', LocaleController.get(LOCALE_KEYS.COMMAND_WANTED, '/wanted'), PERMISSIONS.ADMIN)
    private static handleCommand(player: alt.Player, id: any = null, stars: any): void {
        if (id === null || id === undefined) {
            id = player.id;
        }

        if (stars === null) {
            stars = 0;
        }

        if (typeof stars === 'string') {
            stars = parseInt(stars);
        }

        if (stars >= 6) {
            stars = 5;
        }

        if (stars < 0) {
            stars = 0;
        }

        const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === id);
        if (!target) {
            return;
        }

        Athena.player.emit.message(player, `Wanted Level set to: ${stars}`);
        Athena.player.set.wantedLevel(target, stars);
    }
}
