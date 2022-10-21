import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';

import { command } from '@AthenaServer/decorators/commands';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

class NoClipCommand {
    @command('noclip', LocaleController.get(LOCALE_KEYS.COMMAND_NO_CLIP, '/noclip'), PERMISSIONS.ADMIN)
    private static handleCommand(player: alt.Player): void {
        const isNoClipping: boolean | null = player.getSyncedMeta('NoClipping') as boolean;

        if (!isNoClipping && !player.data.isDead) {
            player.setSyncedMeta('NoClipping', true);
            Athena.player.emit.message(player, `No Clip: ${LocaleController.get(LOCALE_KEYS.LABEL_ON)}`);
            player.visible = false;
            return;
        }

        if (player.data.isDead) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
        }

        player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
        player.setSyncedMeta('NoClipping', false);
        Athena.player.emit.message(player, `No Clip: ${LocaleController.get(LOCALE_KEYS.LABEL_OFF)}`);
        player.visible = true;
        player.health = 199;
    }

    static handleReset(player: alt.Player) {
        player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    }

    static handleCamUpdate(player, pos) {
        player.pos = pos;
    }
}

alt.onClient(SYSTEM_EVENTS.NOCLIP_RESET, NoClipCommand.handleReset);
alt.onClient(SYSTEM_EVENTS.NOCLIP_UPDATE, NoClipCommand.handleCamUpdate);
